use crate::action::VideoAction;
use crate::keybind::KeyBind;
use rand::random;
use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
pub struct HotKey {
    id: i32,
    keybind: KeyBind,
    video_action: VideoAction,
}

impl HotKey {
    pub fn new(keybind: KeyBind, video_action: VideoAction) -> Self {
        Self {
            id: random(),
            keybind,
            video_action,
        }
    }

    pub fn id(&self) -> i32 {
        self.id
    }

    pub fn keybind(&self) -> &KeyBind {
        &self.keybind
    }

    pub fn video_action(&self) -> &VideoAction {
        &self.video_action
    }
}
