use crate::ipc::client::Client;
use common::ipc::ipc_address;
use common::message::Message;
use interprocess::local_socket::tokio::Listener as LocalSocketListener;
use interprocess::local_socket::traits::tokio::Listener;
use interprocess::local_socket::ListenerOptions;
use std::io;
use std::time::Duration;
use tokio::sync::broadcast::{Receiver, Sender};
use tokio::time::interval;

pub struct IpcServer {
    listener: LocalSocketListener,
    sender: Sender<Message>,
    receiver: Receiver<Message>,
}

impl IpcServer {
    pub fn create() -> anyhow::Result<Self> {
        let (tx, rx) = tokio::sync::broadcast::channel(32);
        let name = "koyt.sock";
        let address = ipc_address()?;
        let opts = ListenerOptions::new().name(address);
        let server = match opts.create_tokio() {
            Ok(listener) => IpcServer {
                listener,
                sender: tx,
                receiver: rx,
            },
            Err(e) if e.kind() == io::ErrorKind::AddrInUse => {
                // When a program that uses a file-type socket name terminates its socket server
                // without deleting the file, a "corpse socket" remains, which can neither be
                // connected to nor reused by a new listener. Normally, Interprocess takes care of
                // this on affected platforms by deleting the socket file when the listener is
                // dropped. (This is vulnerable to all sorts of races and thus can be disabled.)
                //
                // There are multiple ways this error can be handled, if it occurs, but when the
                // listener only comes from Interprocess, it can be assumed that its previous instance
                // either has crashed or simply hasn't exited yet.
                eprintln!(
                    "Error: could not start server because the socket file is occupied. Please check
                if {name:?} is in use by another process and try again."
                );
                return Err(e.into());
            }
            _ => unreachable!(),
        };
        Ok(server)
    }

    pub async fn start(self) {
        loop {
            let conn = match self.listener.accept().await {
                Ok(c) => c,
                Err(e) => {
                    eprintln!("There was an error with an incoming connection: {e}");
                    continue;
                }
            };
            let keep_alive = self.sender.clone();
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
            let rx = self.receiver.resubscribe();

            let client = Client::new(conn, rx);
            tokio::spawn(async move {
                if let Err(e) = client.handle().await {
                    eprintln!("error while handling connection: {e}");
                }
            });
        }
    }

    pub fn action_handle(&self) -> ActionHandle {
        ActionHandle {
            sender: self.sender.clone(),
        }
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
