use std::sync::Arc;
use crate::settings::running_app_state::RunningAppState;
use tauri::{App, Manager};
use tokio::sync::RwLock;
use crate::window::open_main_window;

pub fn setup(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    let handle = app.handle().clone();
    let app_state = RunningAppState::load(&handle);
    let app_state = Arc::new(RwLock::new(app_state));
    handle.manage(app_state);
    open_main_window(app.app_handle());
    Ok(())
}
