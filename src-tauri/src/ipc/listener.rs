use common::action::VideoAction;
use interprocess::local_socket::tokio::{Listener as LocalSocketListener, Stream};
use interprocess::local_socket::traits::tokio::Listener;
use tokio::sync::mpsc::Receiver;

pub struct IpcListener {
    listener: LocalSocketListener,
    receiver: Receiver<VideoAction>,
}

impl IpcListener {
    pub async fn accept_connections(self) {
        loop {
            // Sort out situations when establishing an incoming connection caused an error.
            let conn = match self.listener.accept().await {
                Ok(c) => c,
                Err(e) => {
                    eprintln!("There was an error with an incoming connection: {e}");
                    continue;
                }
            };
            // Spawn new parallel asynchronous tasks onto the Tokio runtime and hand the connection
            // over to them so that multiple clients could be processed simultaneously in a
            // lightweight fashion.
            tokio::spawn(async move {
                // The outer match processes errors that happen when we're connecting to something.
                // The inner if-let processes errors that happen during the connection.
                if let Err(e) = IpcListener::handle_conn(conn).await {
                    eprintln!("Error while handling connection: {e}");
                }
            });
        }
    }

    async fn handle_conn(conn: Stream) -> anyhow::Result<()> {
        Ok(())
    }
}

impl IpcListener {
    pub fn new(listener: LocalSocketListener, receiver: Receiver<VideoAction>) -> Self {
        Self { listener, receiver }
    }

    pub fn listener(&self) -> &LocalSocketListener {
        &self.listener
    }
}
