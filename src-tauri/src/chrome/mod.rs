use std::sync::atomic::AtomicBool;
use std::sync::atomic::Ordering::SeqCst;
use tauri::AppHandle;

pub mod host;
pub mod platform;

#[cfg(target_os = "windows")]
use platform::windows as sys;

#[cfg(target_os = "macos")]
use platform::macos as sys;

#[cfg(target_os = "linux")]
use platform::linux as sys;

pub static REGISTERED_HOST: AtomicBool = AtomicBool::new(false);

pub fn register_host_to_chrome_apps(app_handle: &AppHandle) {
    if let Err(why) = sys::register_host_to_chrome_apps(app_handle) {
        let m = native_dialog::MessageDialog::new()
            .set_type(native_dialog::MessageType::Error)
            .set_title("Failed to register extension native host")
            .set_text(
                &format!(
                    "I could not register myself to be able to communicate with your browser! :(\n\
                This is common if you downloaded the app from the Microsoft Store or App Store.\n\
                Would you like to troubleshoot the problem? \n\nError: {:?}",
                    &why,
                )
                .to_string(),
            )
            .show_confirm();
        if let Ok(true) = m {
            let _ = opener::open("https://kbyoutube.com/registry-error");
        }
    } else {
        REGISTERED_HOST.store(true, SeqCst);
    }
}
