use tauri::AppHandle;

pub mod host;
pub mod platform;

#[cfg(target_os = "windows")]
use platform::windows as sys;

#[cfg(target_os = "macos")]
use platform::macos as sys;

pub fn register_host_to_chrome_apps(app_handle: &AppHandle) {
    let _ = sys::register_host_to_chrome_apps(app_handle);
}