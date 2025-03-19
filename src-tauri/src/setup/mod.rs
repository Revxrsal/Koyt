use crate::settings::running_app_state::RunningAppState;
use crate::window::open_main_window;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::sync::Arc;
use tauri::{App, Manager};
use tauri_specta::Event;
use tokio::sync::RwLock;

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
pub enum OxideHotKey {
    Forward,
    Rewind,
    TogglePlay,
    NextVideo,
    PreviousVideo
}

#[derive(Serialize, Deserialize, Debug, Clone, Type, Event)]
pub struct HardwareHotkeyEvent {
    hotkey: OxideHotKey
}

impl HardwareHotkeyEvent {
    pub fn new(hotkey: OxideHotKey) -> Self {
        Self { hotkey }
    }

    pub fn hotkey(&self) -> &OxideHotKey {
        &self.hotkey
    }
}

pub fn setup(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    let handle = app.handle().clone();
    let app_state = RunningAppState::load(&handle);
    let app_state = Arc::new(RwLock::new(app_state));
    handle.manage(app_state);
    open_main_window(app.app_handle());
    Ok(())
}
