use crate::ipc::listener::ActionHandle;
use crate::setup::register_keybind;
use common::hotkey::HotKey;
use common::keybind::KeyBind;
use std::ops::Deref;
use tauri::{AppHandle, State};

#[tauri::command]
#[specta::specta]
pub async fn to_tauri_global_shortcut(key_bind: KeyBind) -> Result<String, ()> {
    Ok(key_bind.to_tauri_shortcut())
}

#[tauri::command]
#[specta::specta]
pub async fn register_keybind_to_system<'a>(
    target: HotKey,
    handle: AppHandle,
    dispatcher: State<'a, ActionHandle>,
) -> Result<(), ()> {
    let sender = dispatcher.deref().clone();
    register_keybind(&handle, &target, sender);
    Ok(())
}
