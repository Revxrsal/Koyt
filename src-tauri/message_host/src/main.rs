mod chrome;
mod launcher;

use crate::chrome::{read_message_from_stdin, write_message};
use crate::launcher::launch_app;
use common::ipc::ipc_address;
use common::message::Message;
use interprocess::local_socket::tokio::Stream as LocalSocketStream;
use interprocess::local_socket::traits::tokio::Stream;
use std::os::windows::io::AsRawHandle;
use std::time::Duration;
use tokio::io::{AsyncReadExt, BufReader};
use tokio::select;
use tokio::time::timeout;

fn handle_message_from_extension(message: Message) -> anyhow::Result<()> {
    if matches!(message, Message::LaunchApp) {
        launch_app();
    }
    Ok(())
}

async fn handle_message_from_app(message: &Message) -> anyhow::Result<()> {
    // println!("Got a message from the app: {:?}", message);
    write_message(message).await;
    Ok(())
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // use std::fs::File;
    // let log_file = File::create(r#"S:\Rust\Koyt\__output__.log"#)?;
    // unsafe {
    //     use winapi::um::processenv::SetStdHandle;
    //     use winapi::um::winbase::STD_OUTPUT_HANDLE;
    //     SetStdHandle(STD_OUTPUT_HANDLE, log_file.as_raw_handle() as *mut _);
    // }
    let mut reader: Option<BufReader<LocalSocketStream>> = None; // No connection at startup
    loop {
        select! {
            message = read_message_from_stdin() => {
                if let Err(why) = handle_message_from_extension(message) {
                    // eprintln!("Error handling message: {:?}", why);
                }
            },
            Ok(message) = listen_to_ipc(&mut reader) => {
                if let Err(why) = handle_message_from_app(&message).await {
                    // eprintln!("Error handling message: {:?}", why);
                }
            }
        }
    }
}

async fn listen_to_ipc(
    reader: &mut Option<BufReader<LocalSocketStream>>,
) -> anyhow::Result<Message> {
    // 🌟 Set a timeout for connection attempts
    if reader.is_none() {
        let conn = match timeout(Duration::from_secs(5), connect()).await {
            Ok(Ok(stream)) => stream, // Successfully connected
            Ok(Err(why)) => return Err(why.into()),
            Err(err) => return Err(err.into()), // Connection failed
        };

        *reader = Some(BufReader::new(conn));
    }
    let reader = reader.as_mut().unwrap();
    let mut length_buffer = [0u8; 4];
    if let Err(why) = reader.read_exact(&mut length_buffer).await {
        // eprintln!("Error reading length: {:?}", why);
        return Err(why.into());
    }

    let message_length = u32::from_le_bytes(length_buffer);

    let mut buffer: Vec<u8> = vec![0; message_length as usize];
    if let Err(err) = reader.read_exact(&mut buffer).await {
        // eprintln!("Failed to read from stream: {}", err);
    };
    let message = postcard::from_bytes::<Message>(&buffer)?;
    Ok(message)
}

pub async fn connect() -> std::io::Result<interprocess::local_socket::tokio::Stream> {
    let name = ipc_address().unwrap();
    LocalSocketStream::connect(name).await
}
