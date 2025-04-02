use crate::ipc::client::Client;
use common::action::VideoAction;
use common::ipc::ipc_address;
use interprocess::local_socket::tokio::Listener as LocalSocketListener;
use interprocess::local_socket::traits::tokio::Listener;
use interprocess::local_socket::ListenerOptions;
use std::io;
use tokio::sync::broadcast::{Receiver, Sender};

pub struct IpcServer {
    listener: LocalSocketListener,
    sender: Sender<VideoAction>,
    receiver: Receiver<VideoAction>,
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
            // Sort out situations when establishing an incoming connection caused an error.
            let conn = match self.listener.accept().await {
                Ok(c) => c,
                Err(e) => {
                    eprintln!("There was an error with an incoming connection: {e}");
                    continue;
                }
            };
            let rx = self.receiver.resubscribe();
            let client = Client::new(conn, rx);
            // Spawn new parallel asynchronous tasks onto the Tokio runtime and hand the connection
            // over to them so that multiple clients could be processed simultaneously in a
            // lightweight fashion.
            tokio::spawn(async move {
                // The outer match processes errors that happen when we're connecting to something.
                // The inner if-let processes errors that happen during the connection.
                if let Err(e) = client.handle().await {
                    eprintln!("Error while handling connection: {e}");
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
    sender: Sender<VideoAction>,
}

impl ActionHandle {
    pub fn sender(&self) -> &Sender<VideoAction> {
        &self.sender
    }
}
