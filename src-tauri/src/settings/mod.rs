pub mod commands;
pub mod persist;
pub mod running_app_state;

use common::hotkey::HotKey;
use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Clone, Serialize, Deserialize, Debug, Type, Default)]
pub struct AppSettings {
    hotkeys: Vec<HotKey>,
    launch_on_startup: bool,
    minimize_to_tray_on_close: bool,
}

impl AppSettings {
    pub fn hotkeys(&self) -> &Vec<HotKey> {
        &self.hotkeys
    }

    pub fn launch_on_startup(&self) -> bool {
        self.launch_on_startup
    }

    pub fn minimize_to_tray_on_close(&self) -> bool {
        self.minimize_to_tray_on_close
    }
}
