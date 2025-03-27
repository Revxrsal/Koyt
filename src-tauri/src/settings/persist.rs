use crate::settings::AppSettings;
use std::fs::{create_dir, File};
use tauri::{AppHandle, Manager};

pub fn save_settings(settings: &AppSettings, handle: &AppHandle) -> std::io::Result<()> {
    if let Ok(app_data_dir) = handle.path().app_data_dir() {
        if !app_data_dir.exists() {
            create_dir(&app_data_dir)?;
        }
        let path = app_data_dir.join("app_data.json");
        let file = File::create(path)?;
        serde_json::to_writer(file, settings)?;
    }
    Ok(())
}

pub fn read_settings(handle: &AppHandle) -> Option<AppSettings> {
    let path = handle.path().app_data_dir().unwrap().join("app_data.json");
    if !path.exists() {
        return None;
    }
    let file = File::open(path).unwrap();
    Some(serde_json::from_reader(file).unwrap_or_default())
}
