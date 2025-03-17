mod add;
mod enable;
mod handle;
mod remove;

use crate::extensions::sys::enable::set_extension_enabled;
use crate::extensions::win::add::add_extension;
use crate::extensions::win::remove::remove_extension;
use crate::extensions::Error;
use crate::extensions::Error::TauriError;
use crate::extensions::PlatformExtensionManager;
use std::path::PathBuf;
use std::slice::from_raw_parts;
use tauri::Webview;
use windows_core::PWSTR;

pub struct ExtensionManager;

impl PlatformExtensionManager for ExtensionManager {
    fn add_extension(webview: &Webview, directory: PathBuf) -> Result<(), Error> {
        webview
            .with_webview(move |w| {
                add_extension(&w, &directory).unwrap();
            })
            .map_err(|e| TauriError(e))?;
        Ok(())
    }

    fn remove_extension(webview: &Webview, extension_name: &str) -> Result<(), Error> {
        let extension_name = extension_name.to_string();
        webview
            .with_webview(move |v| {
                remove_extension(&v, &extension_name).unwrap();
            })
            .map_err(|e| TauriError(e))?;
        Ok(())
    }

    fn set_extension_enabled(
        webview: &Webview,
        extension_name: &str,
        enabled: bool,
    ) -> Result<(), Error> {
        let extension_name = extension_name.to_string();
        webview
            .with_webview(move |v| {
                set_extension_enabled(&v, &extension_name, enabled).unwrap();
            })
            .map_err(|e| TauriError(e))?;
        Ok(())
    }
}

pub fn to_string(pwstr: PWSTR) -> String {
    unsafe {
        if pwstr.is_null() {
            return String::new();
        }
        let mut len = 0;
        while *pwstr.0.add(len) != 0 {
            len += 1;
        }

        let wide_slice = from_raw_parts(pwstr.0, len);
        String::from_utf16(wide_slice).unwrap()
    }
}
