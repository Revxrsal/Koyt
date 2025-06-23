mod chrome;
mod launcher;

use crate::chrome::{read_message_from_stdin, write_message};
use crate::launcher::launch_app;
use common::ipc::ipc_address;
use common::message::Message;
use interprocess::local_socket::tokio::Stream as LocalSocketStream;
use interprocess::local_socket::traits::tokio::Stream;
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
    let mut reader: Option<BufReader<LocalSocketStream>> = None;
    loop {
        select! {
            message = read_message_from_stdin() => {
                if let Err(why) = handle_message_from_extension(message) {
                    let err_str = why.to_string();
                    show_error("Failed to handle message from extension", &err_str);
                }
            },
            Ok(message) = listen_to_ipc(&mut reader) => {
                if let Err(why) = handle_message_from_app(&message).await {
                    let err_str = why.to_string();
                    show_error("Failed to read incoming IPC message from native app", &err_str);
                }
            }
        }
    }
}

async fn listen_to_ipc(
    reader: &mut Option<BufReader<LocalSocketStream>>,
) -> anyhow::Result<Message> {
    while reader.is_none() {
        match timeout(Duration::from_secs(5), connect()).await {
            Ok(Ok(stream)) => {
                *reader = Some(BufReader::new(stream));
            }
            Ok(Err(e)) => {
                tokio::time::sleep(Duration::from_secs(5)).await;
            }
            Err(_) => {
                tokio::time::sleep(Duration::from_secs(5)).await;
            }
        }
    }
    let buf = reader.as_mut().unwrap();
    let mut length_buffer = [0u8; 4];
    if let Err(why) = buf.read_exact(&mut length_buffer).await {
        let err_str = why.to_string();
        show_error(
            "Failed to read the message length from native app",
            &err_str,
        );
        *reader = None;
        return Err(why.into());
    }

    let message_length = u32::from_le_bytes(length_buffer);

    let mut buffer: Vec<u8> = vec![0; message_length as usize];
    if let Err(why) = buf.read_exact(&mut buffer).await {
        let err_str = why.to_string();
        show_error("Failed to read incoming message from native app", &err_str);
        *reader = None;
        return Err(why.into());
    };
    let message = postcard::from_bytes::<Message>(&buffer)?;
    Ok(message)
}

pub async fn connect() -> std::io::Result<interprocess::local_socket::tokio::Stream> {
    let name = ipc_address().unwrap();
    LocalSocketStream::connect(name).await
}

pub fn show_error(title: &str, error: &str) {
    native_dialog::MessageDialog::new()
        .set_type(native_dialog::MessageType::Error)
        .set_title(title)
        .set_text(error)
        .show_alert()
        .unwrap();
}
