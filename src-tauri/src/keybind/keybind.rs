use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
pub struct KeyBind {
    pub shift: bool,
    pub ctrl: bool,
    pub alt: bool,
    pub meta: bool,
    pub key: String,
}

impl KeyBind {
    // Convert the KeyBind struct to the Tauri global shortcut format
    pub fn to_tauri_shortcut(&self) -> String {
        let mut shortcut = self.key.to_uppercase(); // Uppercase the main key (e.g., 'a' to 'A')

        if self.ctrl {
            shortcut.insert_str(0, "Ctrl+");
        }
        if self.shift {
            shortcut.insert_str(0, "Shift+");
        }
        if self.alt {
            shortcut.insert_str(0, "Alt+");
        }
        if self.meta {
            shortcut.insert_str(0, "Command+");
        }

        shortcut
    }
}
