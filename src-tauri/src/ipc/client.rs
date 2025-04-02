use common::action::VideoAction;
use common::message::Message;
use interprocess::local_socket::tokio::Stream;
use tokio::io::AsyncWriteExt;
use tokio::sync::broadcast::Receiver;

pub struct Client {
    conn: Stream,
    receiver: Receiver<VideoAction>,
}

impl Client {
    pub fn new(conn: Stream, receiver: Receiver<VideoAction>) -> Self {
        Self { conn, receiver }
    }

    pub fn conn(&self) -> &Stream {
        &self.conn
    }

    pub async fn handle(mut self) -> anyhow::Result<()> {
        while let Ok(action) = self.receiver.recv().await {
            let result = self.write_message(&Message::ExecuteAction { action }).await;
            if let Err(e) = result {
                println!("Failed to send action to receiver: {}", e);
                self.conn.shutdown().await?;
                break;
            }
        }
        Ok(())
    }

    pub async fn write_message(&self, message: &Message) -> anyhow::Result<()> {
        let data = postcard::to_allocvec(message)?;
        let data_len = data.len() as u32;
        self.conn().write(data_len.to_le_bytes().as_slice()).await?;
        self.conn().write(data.as_slice()).await?;
        self.conn().flush().await?;
        Ok(())
    }
}
