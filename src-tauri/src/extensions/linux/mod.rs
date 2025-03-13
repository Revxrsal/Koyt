use crate::extensions::PlatformExtensionManager;
use crate::Error;
use std::path::PathBuf;
use tauri::Webview;
use Error::Unsupported;

pub struct ExtensionManager;

#[allow(unused_variables)]
impl PlatformExtensionManager for ExtensionManager {
    fn set_extension_enabled(webview: &Webview, extension_name: &str, enabled: bool) -> Result<(), Error> {
        Err(Unsupported)
    }

    fn remove_extension(webview: &Webview, extension_name: &str) -> Result<(), Error> {
        Err(Unsupported)
    }

    fn add_extension(webview: &Webview, directory: PathBuf) -> Result<(), Error> {
        Err(Unsupported)
    }
}