use std::path::PathBuf;
use tauri::{AppHandle, Manager};
use crate::extensions::{PlatformExtensionManager, SystemExtensionManager};

#[specta::specta]
#[tauri::command]
pub async fn add_browser_extension<'a>(
    extension_folder: String,
    app_handle: AppHandle,
) -> Result<(), String> {
    let webview_windows = app_handle.webview_windows();
    let window = webview_windows.get("main");
    if let Some(window) = window {
        SystemExtensionManager::add_extension(window.as_ref(), PathBuf::from(extension_folder))
            .unwrap();
        return Ok(());
    }
    Ok(())
}

#[specta::specta]
#[tauri::command]
pub async fn remove_browser_extension<'a>(
    extension_name: String,
    app_handle: AppHandle,
) -> Result<(), String> {
    let webview_windows = app_handle.webview_windows();
    let window = webview_windows.get("main");
    if let Some(window) = window {
        SystemExtensionManager::remove_extension(window.as_ref(), &extension_name)
            .unwrap();
        return Ok(());
    }
    Ok(())
}