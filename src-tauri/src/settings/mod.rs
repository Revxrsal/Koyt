pub mod commands;
pub mod persist;
pub mod running_app_state;

use crate::keybind::HotKey;
use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Clone, Serialize, Deserialize, Debug, Type, Default)]
pub struct AppSettings {
    pub hotkeys: Vec<HotKey>,
}

impl AppSettings {
    
}
