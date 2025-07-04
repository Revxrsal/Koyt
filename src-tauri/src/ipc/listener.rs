use crate::chrome::REGISTERED_HOST;
use crate::event::client::{ClientConnectedEvent, ClientDisconnectedEvent};
use crate::ipc::client::Client;
use common::ipc::ipc_address;
use common::message::Message;
use interprocess::local_socket::tokio::Listener as LocalSocketListener;
use interprocess::local_socket::traits::tokio::Listener;
use interprocess::local_socket::ListenerOptions;
use std::io;
use std::sync::atomic::Ordering::SeqCst;
use std::sync::atomic::AtomicU32;
use std::time::Duration;
use tauri::AppHandle;
use tauri_specta::Event;
use tokio::sync::broadcast::{Receiver, Sender};
use tokio::time::interval;

pub static CONNECTED_CLIENTS: AtomicU32 = AtomicU32::new(0);

pub struct IpcServer {
    listener: LocalSocketListener,
    sender: Sender<Message>,
    receiver: Receiver<Message>,
}

impl IpcServer {
    pub fn create() -> anyhow::Result<Self> {
        let (tx, rx) = tokio::sync::broadcast::channel(32);
        let address = ipc_address()?;
        let opts = ListenerOptions::new().name(address);
        let server = match opts.create_tokio() {
            Ok(listener) => IpcServer {
                listener,
                sender: tx,
                receiver: rx,
            },
            Err(e) if e.kind() == io::ErrorKind::AddrInUse => {
                let _ = native_dialog::MessageDialog::new()
                    .set_type(native_dialog::MessageType::Error)
                    .set_title("Failed to start IPC server")
                    .set_text(&"Error: could not start server because the socket file is occupied. The app might have crashed and was unable to clean leftovers. Please restart the app a few times".to_string())
                    .show_alert();
                // When a program that uses a file-type socket name terminates its socket server
                // without deleting the file, a "corpse socket" remains, which can neither be
                // connected to nor reused by a new listener. Normally, Interprocess takes care of
                // this on affected platforms by deleting the socket file when the listener is
                // dropped. (This is vulnerable to all sorts of races and thus can be disabled.)
                //
                // There are multiple ways this error can be handled, if it occurs, but when the
                // listener only comes from Interprocess, it can be assumed that its previous instance
                // either has crashed or simply hasn't exited yet.
                return Err(e.into());
            }
            e => {
                let error = e.err().unwrap();
                let _ = native_dialog::MessageDialog::new()
                    .set_type(native_dialog::MessageType::Error)
                    .set_title("Failed to start IPC server")
                    .set_text(&format!("Error: could not start IPC server. Please restart the app a few times. Error:\n{:?}", &error))
                    .show_alert();
                return Err(error.into());
            }
        };
        Ok(server)
    }

    pub async fn start(self, app_handle: AppHandle) {
        loop {
            let conn = match self.listener().accept().await {
                Ok(c) => c,
                Err(e) => {
                    eprintln!("There was an error with an incoming connection: {e}");
                    continue;
                }
            };
            let _ = ClientConnectedEvent {
                total_count: CONNECTED_CLIENTS.fetch_add(1, SeqCst) + 1,
            }
            .emit(&app_handle);
            REGISTERED_HOST.store(true, SeqCst);
            let keep_alive = self.sender().clone();
            tokio::spawn(async move {
                let mut interval = interval(Duration::from_secs(5));
                loop {
                    if let Err(why) = keep_alive.send(Message::KeepAlive) {
                        eprintln!("failed to send keep alive messages to the extension: {why}");
                        return;
                    }
                    interval.tick().await;
                }
            });
            let rx = self.receiver().resubscribe();

            let client = Client::new(conn, rx);
            let app_handle = app_handle.clone();
            tokio::spawn(async move {
                if let Err(e) = client.handle().await {
                    eprintln!("error while handling connection: {e}");
                } else {
                    let _ = ClientDisconnectedEvent {
                        total_count: CONNECTED_CLIENTS.fetch_sub(1, SeqCst) - 1,
                    }
                    .emit(&app_handle);
                }
            });
        }
    }

    pub fn action_handle(&self) -> ActionHandle {
        ActionHandle {
            sender: self.sender.clone(),
        }
    }

    pub fn receiver(&self) -> &Receiver<Message> {
        &self.receiver
    }

    pub fn sender(&self) -> &Sender<Message> {
        &self.sender
    }

    pub fn listener(&self) -> &LocalSocketListener {
        &self.listener
    }
}

#[derive(Debug, Clone)]
pub struct ActionHandle {
    sender: Sender<Message>,
}

impl ActionHandle {
    pub fn sender(&self) -> &Sender<Message> {
        &self.sender
    }
}
