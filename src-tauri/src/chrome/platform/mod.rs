use crate::chrome::host::NativeMessageHost;
use crate::chrome::host::NativeMessageHostType::Stdio;
use std::env::current_exe;
use std::fs;
use std::fs::read_dir;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

/// The native Chrome app ID
pub(crate) const NATIVE_APP_ID: &'static str = "com.kbyoutube";

/// The Chrome extension ID (for auto-installing the extension)
pub(crate) const EXTENSION_ID: &'static str = "hdffofcnfjaehdacnbhccnhnomaihcok";

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
                    // let path = absolute(&path);
                    // if let Err(err) = path {
                    //     let _ = native_dialog::MessageDialog::new()
                    //         .set_type(native_dialog::MessageType::Error)
                    //         .set_title("Failed to resolve native host file")
                    //         .set_text(&format!("Failed to find the message_host executable: {:?}", err).to_string())
                    //         .show_alert();
                    //
                    //     return None;
                    // }
                    // return Some(path.unwrap());
                    return Some(path);
                }
            }
        }
    }
    None
}

fn files_are_equal(path1: &PathBuf, path2: &PathBuf) -> std::io::Result<bool> {
    let content1 = fs::read(path1)?;
    let content2 = fs::read(path2)?;
    Ok(content1 == content2)
}

fn get_app_native_message_host(app_handle: &AppHandle) -> NativeMessageHost {
    let src_path = get_message_host_file().expect("message host file not found in installation dir");
    let dest_path = app_handle.path().app_local_data_dir().unwrap();
    #[cfg(target_os = "windows")]
    let dest_path = dest_path.join(format!("{}.exe", HOST_EXECUTABLE));
    #[cfg(not(target_os = "windows"))]
    let dest_path = dest_path.join(HOST_EXECUTABLE);
    if !dest_path.exists() || !files_are_equal(&src_path, &dest_path).unwrap() {
        fs::copy(&src_path, &dest_path).unwrap();
    }
    NativeMessageHost {
        name: String::from(NATIVE_APP_ID),
        description: String::from("Keyboard-operated YouTube"),
        path: dest_path,
        app_type: Stdio,
        allowed_origins: vec![format!("chrome-extension://{}/", EXTENSION_ID)],
    }
}
