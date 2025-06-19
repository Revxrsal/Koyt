use crate::ipc::listener::ActionHandle;
use crate::setup::register_keybind;
use crate::TauriRunningAppState;
use common::hotkey::HotKey;
use common::keybind::KeyBind;
use specta::specta;
use std::collections::HashMap;
use std::ops::Deref;
use tauri::{command, AppHandle, State};

#[command]
#[specta::specta]
pub async fn to_tauri_global_shortcut(key_bind: KeyBind) -> Result<String, ()> {
    Ok(key_bind.to_tauri_shortcut())
}

#[command]
#[specta]
pub async fn register_keybind_to_system<'a>(
    target: HotKey,
    handle: AppHandle,
    dispatcher: State<'a, ActionHandle>,
) -> Result<(), String> {
    let sender = dispatcher.deref().clone();
    register_keybind(&handle, &target, sender).map_err(|err| err.to_string())
}

#[command]
#[specta]
pub async fn get_failed_key_binds<'a>(
    state: TauriRunningAppState<'a>,
) -> Result<HashMap<i32, String>, ()> {
    let state = state.read().await;
    Ok(state.failed_keybinds().clone())
}
