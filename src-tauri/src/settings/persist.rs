use crate::encryption::encryptor;
use crate::settings::AppSettings;
use std::fs::create_dir;
use tauri::{AppHandle, Manager};

pub fn save_settings(settings: &AppSettings, handle: &AppHandle) -> std::io::Result<()> {
    if let Ok(app_data_dir) = handle.path().app_data_dir() {
        if !app_data_dir.exists() {
            create_dir(&app_data_dir)?;
        }
        let path = app_data_dir.join("app_data.dat");
        let content = serde_json::to_vec(settings)?;
        let content = encryptor().encrypt(content.as_slice()).unwrap();
        std::fs::write(&path, content)?;
    }
    Ok(())
}

pub fn read_settings(handle: &AppHandle) -> Option<AppSettings> {
    let path = handle.path().app_data_dir().unwrap().join("app_data.dat");
    if !path.exists() {
        return None;
    }
    let content = std::fs::read(path).unwrap();
    let content = encryptor().decrypt(&content).unwrap();
    Some(serde_json::from_slice(content.as_slice()).unwrap_or_default())
}
