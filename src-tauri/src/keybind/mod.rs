use serde::{Deserialize, Serialize};
use specta::Type;
use crate::keybind::action::VideoAction;
use crate::keybind::keybind::KeyBind;

pub mod action;
pub mod keybind;

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
pub struct HotKey {
    pub keybind: KeyBind,
    pub video_action: VideoAction,
}
