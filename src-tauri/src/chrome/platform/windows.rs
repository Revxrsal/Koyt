use std::fs::{create_dir_all, File};
use std::io;
use std::path::PathBuf;

use tauri::{AppHandle, Manager};
use winreg::enums::HKEY_CURRENT_USER;
use winreg::RegKey;

use crate::chrome::platform::{
    get_app_native_message_host, EXTENSION_ID, HOST_FILE_NAME, NATIVE_APP_ID,
};

#[cfg(target_os = "windows")]
pub fn get_chrome_json(app_handle: &AppHandle) -> PathBuf {
    let parent = app_handle.path().app_data_dir().unwrap();
    create_dir_all(&parent)
        .expect("failed to create Google/Chrome/NativeMessagingHosts/ directory");
    let path = parent.join(HOST_FILE_NAME);
    let mut json_file =
        File::create(&path).expect("failed to create a Chrome native message host file");
    serde_json::to_writer(&mut json_file, &get_app_native_message_host())
        .expect(&format!("failed to write content to {}.", HOST_FILE_NAME));
    path
}

#[cfg(target_os = "windows")]
pub fn register_host_to_chrome_apps(app_handle: &AppHandle) -> anyhow::Result<()> {
    let file = get_chrome_json(app_handle);
    register_to_registry(
        format!(
            r"Software\Google\Chrome\NativeMessagingHosts\{}",
            NATIVE_APP_ID
        ),
        &file,
    )?;
    register_to_registry(
        format!(
            r"Software\Microsoft\Edge\NativeMessagingHosts\{}",
            NATIVE_APP_ID
        ),
        &file,
    )?;
    install_extension(EXTENSION_ID)?;
    Ok(())
}

fn register_to_registry(path: String, file: &PathBuf) -> anyhow::Result<()> {
    let (key, _) = RegKey::predef(HKEY_CURRENT_USER).create_subkey(path)?;
    key.set_value("", &file.to_str().unwrap().replace('\\', "/"))?;
    Ok(())
}

pub fn install_extension(extension_id: &str) -> io::Result<()> {
    let key = RegKey::predef(HKEY_CURRENT_USER);
    let (key, _) = key.create_subkey(format!(
        "Software\\Google\\Chrome\\Extensions\\{}",
        extension_id
    ))?;
    key.set_value(
        "update_url",
        &"https://clients2.google.com/service/update2/crx",
    )?;
    Ok(())
}
