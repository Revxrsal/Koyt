use crate::settings::running_app_state::RunningAppState;
use crate::window::open_main_window;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::sync::Arc;
use tauri::{App, Manager};
use tauri_specta::Event;
use tokio::sync::RwLock;

#[derive(Serialize, Deserialize, Debug, Clone, Type, Event)]
pub struct GlobalToggleEvent;

#[derive(Serialize, Deserialize, Debug, Clone, Type, Event)]
pub struct GlobalRewindEvent;

#[derive(Serialize, Deserialize, Debug, Clone, Type, Event)]
pub struct GlobalForwardEvent;

pub fn setup(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    let handle = app.handle().clone();
    let app_state = RunningAppState::load(&handle);
    let app_state = Arc::new(RwLock::new(app_state));
    handle.manage(app_state);
    open_main_window(app.app_handle());
    Ok(())
}
