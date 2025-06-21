#![allow(async_fn_in_trait)]
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tokio::main]
async fn main() {
    #[cfg(not(debug_assertions))]
    std::panic::set_hook(Box::new(|info| {
        log::error!("Panicked: {:?}", info);
        #[cfg(not(debug_assertions))]
        native_dialog::MessageDialog::new()
            .set_type(native_dialog::MessageType::Error)
            .set_title("Failed to start KeyBoard-Operated YouTube")
            .set_text(&format!("Error: {:#?}", info))
            .show_alert()
            .unwrap();
        open_log_file();
    }));
    app_lib::run().await;
}

#[cfg(not(debug_assertions))]
fn open_log_file() {
    use common::{APP_NAME, IDENTIFIER};
    #[cfg(target_os = "macos")]
    let path = dirs_next::home_dir()
        .ok_or(tauri::Error::UnknownPath)
        .map(|dir| {
            dir.join("Library/Logs")
                .join(IDENTIFIER)
                .join(format!("{}.log", APP_NAME))
        });

    #[cfg(not(target_os = "macos"))]
    let path = dirs_next::data_local_dir()
        .ok_or(tauri::Error::UnknownPath)
        .map(|dir| {
            dir.join(IDENTIFIER)
                .join("logs")
                .join(format!("{}.log", APP_NAME))
        });
    if let Ok(path) = path {
        opener::reveal(path).unwrap();
    }
}
