use crate::chrome::host::NativeMessageHost;
use crate::chrome::host::NativeMessageHostType::Stdio;
use std::env::current_exe;
use std::fs::read_dir;
use std::path::PathBuf;

/// The native Chrome app ID
pub(crate) const NATIVE_APP_ID: &'static str = "com.kbyoutube";

/// The Chrome extension ID (for auto-installing the extension)
pub(crate) const EXTENSION_ID: &'static str = "hdffofcnfjaehdacnbhccnhnomaihcok";
// pub(crate) const EXTENSION_ID: &'static str = "phgfelfegpojplnieiojbnefdeoafgog";

/// The name of the host file
pub(crate) const HOST_FILE_NAME: &'static str = "NativeChromeHost.json";

/// The executable message host
pub(crate) const HOST_EXECUTABLE: &'static str = "message_host";

#[cfg(target_os = "macos")]
pub(crate) mod macos;

#[cfg(target_os = "windows")]
pub(crate) mod windows;

#[cfg(target_os = "linux")]
pub(crate) mod linux;

fn get_message_host_file() -> Option<PathBuf> {
    let exe = current_exe().unwrap();
    let dir = exe.parent().unwrap();
    for file in read_dir(&dir).unwrap() {
        if let Ok(file) = file {
            let path = file.path();
            if !path.is_file() {
                continue;
            }
            if let Some(stem) = path.file_stem() {
                if stem
                    .to_str()
                    .unwrap_or_default()
                    .starts_with(HOST_EXECUTABLE)
                {
                    return Some(path);
                }
            }
        }
    }
    None
}

fn get_app_native_message_host() -> NativeMessageHost {
    let host_file =
        get_message_host_file().expect("message_host file not found in installation directory");
    NativeMessageHost {
        name: String::from(NATIVE_APP_ID),
        description: String::from("Keyboard-operated YouTube"),
        path: host_file,
        app_type: Stdio,
        allowed_origins: vec![format!("chrome-extension://{}/", EXTENSION_ID)],
    }
}
