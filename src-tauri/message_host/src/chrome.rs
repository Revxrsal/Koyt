use common::message::Message;
use serde::Serialize;
use tokio::io::{AsyncReadExt, AsyncWriteExt};

pub async fn read_message_from_stdin() -> Message {
    let mut stdin = tokio::io::stdin();
    let mut buffer = [0u8; 4];
    stdin.read_exact(&mut buffer).await.unwrap();
    let size = u32::from_le_bytes(buffer) as usize;

    let mut buffer = vec![0; size];
    stdin.read_exact(&mut buffer).await.unwrap();
    serde_json::from_slice(&buffer).unwrap()
}

pub async fn write_message<T>(response: &T) -> anyhow::Result<()>
where
    T: ?Sized + Serialize,
{
    let mut stdout = tokio::io::stdout();
    let response_data = serde_json::to_vec(&response)?;
    let response_size = response_data.len() as u32;

    stdout.write_u32_le(response_size).await?;
    stdout.write_all(&response_data).await?;
    stdout.flush().await?;
    Ok(())
}
