use font_kit::source::SystemSource;
use specta::specta;
use tauri::command;

#[command]
#[specta]
pub async fn open_url(url: String) -> Result<(), String> {
    opener::open_browser(url).map_err(|e| e.to_string())
}

#[command]
#[specta]
pub async fn get_system_fonts() -> Result<Vec<String>, String> {
    let source = SystemSource::new();
    source.all_families().map_err(|e| e.to_string())
}
