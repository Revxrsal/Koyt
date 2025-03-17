pub mod persist;
pub mod running_app_state;

use serde::{Deserialize, Serialize};
use specta::Type;
use crate::extensions::BrowserExtension;

#[derive(Clone, Serialize, Deserialize, Debug, Type, Default)]
pub struct AppSettings {
    downloaded_extensions: Vec<BrowserExtension>,
}

impl AppSettings {

    pub fn downloaded_extensions(&self) -> &Vec<BrowserExtension> {
        &self.downloaded_extensions
    }

    pub fn downloaded_extensions_mut(&mut self) -> &mut Vec<BrowserExtension> {
        &mut self.downloaded_extensions
    }
}
