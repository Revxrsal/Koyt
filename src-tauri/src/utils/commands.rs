use crate::chrome::REGISTERED_HOST;
use font_kit::source::SystemSource;
use specta::specta;
use std::sync::atomic::Ordering;
use tauri::command;

#[command]
#[specta]
pub async fn open_url(url: String) -> Result<(), String> {
    opener::open_browser(url).map_err(|e| e.to_string())
}

#[command]
#[specta]
pub async fn reveal_file(path: String) -> Result<(), String> {
    opener::reveal(path).map_err(|e| e.to_string())
}

#[command]
#[specta]
pub async fn get_system_fonts() -> Result<Vec<String>, String> {
    let source = SystemSource::new();
    source.all_families().map_err(|e| e.to_string())
}

#[command]
#[specta]
pub async fn get_latest_version() -> Result<String, String> {
    let response = reqwest::get("https://kbyoutube.com/api/v1/get-version").await;
    if let Ok(response) = response {
        let v: String = response.json().await.unwrap();
        return Ok(v);
    }
    Err(format!("{}", response.err().unwrap()))
}

#[command]
#[specta]
pub async fn failed_to_register_hosts() -> Result<bool, ()> {
    return Ok(REGISTERED_HOST.load(Ordering::SeqCst));
}
