use crate::chrome::platform::windows::get_chrome_json;
use crate::chrome::platform::NATIVE_APP_ID;
use crate::chrome::REGISTERED_HOST;
use crate::TauriRunningAppState;
use font_kit::source::SystemSource;
use specta::specta;
use std::sync::atomic::Ordering;
use tauri::{command, AppHandle};
use tauri_plugin_dialog::DialogExt;

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

#[command]
#[specta]
pub async fn get_native_chrome_path(app_handle: AppHandle) -> Result<String, ()> {
    let path = get_chrome_json(&app_handle);
    return Ok(path.to_str().unwrap().to_string().replace('\\', "/"));
}

#[command]
#[specta]
pub async fn install_registry_scripts<'a>(
    state: TauriRunningAppState<'a>,
) -> Result<bool, String> {
    #[cfg(target_os = "windows")]
    {
        use crate::chrome::platform::windows::get_chrome_json;

        let settings = state.read().await;
        let app_handle = settings.app_handle().clone();
        if let Some(file_path) = app_handle.dialog().file().blocking_save_file() {
            if let Some(file_path) = file_path.as_path() {
                let path_buf = get_chrome_json(&app_handle);
                let native_path = path_buf
                    .to_str()
                    .unwrap();
                let content = include_str!("../../windows.template.reg")
                    .replace("{{NATIVE_APP_ID}}", NATIVE_APP_ID)
                    .replace("{{NATIVE_PATH}}", &native_path.replace('\\', "\\\\"));
                let res = std::fs::write(file_path, content);
                if let Err(e) = res {
                    return Err(format!("{}", e));
                }
                opener::reveal(file_path).unwrap();
                return Ok(true);
            }
        }
        return Ok(false);
    }
    #[cfg(not(target_os = "windows"))]
    return Err(String::from("This command can only be used on Windows"));
}

#[command]
#[specta]
pub fn is_microsoft_version() -> bool {
    return cfg!(target_os = "windows") && cfg!(feature = "ms-store");
}
