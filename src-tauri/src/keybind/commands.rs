use crate::setup::register_keybind;
use common::hotkey::HotKey;
use common::keybind::KeyBind;
use tauri::AppHandle;

#[tauri::command]
#[specta::specta]
pub async fn to_tauri_global_shortcut(key_bind: KeyBind) -> Result<String, ()> {
    Ok(key_bind.to_tauri_shortcut())
}

#[tauri::command]
#[specta::specta]
pub async fn register_keybind_to_system(target: HotKey, handle: AppHandle) -> Result<(), ()> {
    register_keybind(&handle, &target, );
    Ok(())
}
