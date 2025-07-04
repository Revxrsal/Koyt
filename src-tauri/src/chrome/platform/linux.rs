use std::fs::{create_dir_all, File};
use std::{fs, io};
use std::path::PathBuf;

use dirs_next::data_local_dir;
use tauri::AppHandle;

use crate::chrome::platform::{EXTENSION_ID, get_app_native_message_host, NATIVE_APP_ID};

#[cfg(target_os = "linux")]
fn get_chrome_json(app_handle: &AppHandle) -> PathBuf {
    let parent = dirs_next::data_local_dir().unwrap()
        .join("Google")
        .join("Chrome")
        .join("NativeMessagingHosts");
    create_dir_all(&parent).expect("failed to create Google/Chrome/NativeMessagingHosts/ directory");
    let path = parent.join(format!("{}.json", NATIVE_APP_ID));
    let mut json_file = File::create(&path).expect("failed to create a Chrome native message host file");
    serde_json::to_writer(&mut json_file, &get_app_native_message_host(app_handle))
        .expect(&format!("failed to write content to {}.json", NATIVE_APP_ID));
    return path;
}

#[cfg(target_os = "linux")]
pub fn register_host_to_chrome_apps(app_handle: &AppHandle) {
    get_chrome_json(app_handle);
    install_extension(EXTENSION_ID).unwrap();
}

#[cfg(target_os = "linux")]
fn install_extension(extension_id: &str) -> io::Result<()> {
    let app_support = data_local_dir();
    if let Some(app_support) = app_support {
        let external_extensions_dir = app_support
            .join("Google")
            .join("Chrome")
            .join("External Extensions");
        create_dir_all(&external_extensions_dir).expect("failed to create External Extension directory");
        let ext_file = external_extensions_dir.join(format!("{}.json", extension_id));
        fs::write(ext_file, r#"{"external_update_url": "https://clients2.google.com/service/update2/crx"}"#)?;
    }
    return Ok(());
}