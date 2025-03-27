use crate::settings::running_app_state::RunningAppState;
use crate::settings::AppSettings;
use specta::specta;
use std::ops::Deref;
use std::sync::Arc;
use tauri::{command, State, WebviewWindow};
use tokio::sync::RwLock;

pub type TauriRunningAppState<'a> = State<'a, Arc<RwLock<RunningAppState>>>;

#[command]
#[specta]
pub async fn get_settings<'a>(state: TauriRunningAppState<'a>) -> Result<AppSettings, ()> {
    let state = state.read().await;
    Ok(state.settings().clone())
}

#[command]
#[specta]
pub async fn set_settings<'a>(
    app_settings: AppSettings,
    state: TauriRunningAppState<'a>,
) -> Result<(), ()> {
    let mut current = state.write().await;
    *current.settings_mut() = app_settings;
    drop(current);

    RunningAppState::schedule_saving(Arc::clone(state.deref())).await;
    Ok(())
}

#[command]
#[specta]
pub async fn toggle_fullscreen(window: WebviewWindow) -> Result<(), ()> {
    let full_screen = window.is_fullscreen().unwrap_or_default();
    window.set_fullscreen(!full_screen).unwrap();
    Ok(())
}
