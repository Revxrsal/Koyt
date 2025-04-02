use common::ipc::ipc_address;
use common::message::Message;
use interprocess::local_socket::tokio::Stream as LocalSocketStream;
use interprocess::local_socket::traits::tokio::Stream;
use tokio::io::{AsyncReadExt, BufReader};

fn handle_message(message: Message) -> anyhow::Result<()> {
    println!("Got a message: {:?}", message);
    Ok(())
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let address = ipc_address()?;
    let conn = LocalSocketStream::connect(address).await?;
    let mut reader = BufReader::new(conn);
    loop {
        let mut length_buffer = [0u8; 4];
        if let Err(why) = reader.read_exact(&mut length_buffer).await {
            println!("Error reading length: {:?}", why);
            break;
        }

        let message_length = u32::from_le_bytes(length_buffer);

        let mut buffer: Vec<u8> = vec![0; message_length as usize];
        if let Err(err) = reader.read_exact(&mut buffer).await {
            println!("Failed to read from stream: {}", err);
        };
        let message = postcard::from_bytes::<Message>(&buffer)?;
        handle_message(message)?;
    }
    Ok(())
}
