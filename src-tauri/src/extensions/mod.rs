#[cfg(target_os = "windows")]
mod win;

#[cfg(target_os = "windows")]
use win as sys;

#[cfg(target_os = "macos")]
mod macos;

#[cfg(target_os = "macos")]
use macos as sys;

#[cfg(target_os = "linux")]
mod linux;

pub mod commands;
pub mod downloader;
pub mod manifest;
pub mod version;

#[cfg(target_os = "linux")]
use linux as sys;

pub type SystemExtensionManager = sys::ExtensionManager;

use serde::{Deserialize, Serialize};
use specta::Type;
use std::path::PathBuf;
use tauri::Webview;

/// A struct that contains basic information about browser extensions
#[derive(Clone, Serialize, Deserialize, Debug, Type)]
pub struct BrowserExtension {
    id: String,
    name: String,
    version: String,
    description: String,
    directory: String,
    enabled: bool,
}

impl BrowserExtension {
    pub fn new(
        id: impl Into<String>,
        name: impl Into<String>,
        version: impl Into<String>,
        description: impl Into<String>,
        directory: impl Into<String>,
    ) -> Self {
        Self {
            id: id.into(),
            name: name.into(),
            version: version.into(),
            description: description.into(),
            directory: directory.into(),
            enabled: true,
        }
    }

    pub fn id(&self) -> &str {
        &self.id
    }

    pub fn name(&self) -> &str {
        &self.name
    }

    pub fn enabled(&self) -> bool {
        self.enabled
    }

    pub fn version(&self) -> &str {
        &self.version
    }

    pub fn description(&self) -> &str {
        &self.description
    }

    pub fn directory(&self) -> &str {
        &self.directory
    }
}

pub trait PlatformExtensionManager {
    fn add_extension(webview: &Webview, directory: PathBuf) -> Result<(), Error>;

    fn remove_extension(webview: &Webview, extension_name: &str) -> Result<(), Error>;

    fn set_extension_enabled(
        webview: &Webview,
        extension_name: &str,
        enabled: bool,
    ) -> Result<(), Error>;
}

pub trait ExtensionExt {
    fn id(&self) -> String;

    fn name(&self) -> String;

    fn is_enabled(&self) -> bool;

    fn set_enabled(&self, enabled: bool);

    fn remove(&self);
}

/// Represents an Error that occurs when adding a browser extension
#[derive(Debug)]
pub enum Error {
    Unsupported,
    TauriError(tauri::Error),
    #[cfg(target_os = "windows")]
    WindowsError(windows_core::Error),
}
