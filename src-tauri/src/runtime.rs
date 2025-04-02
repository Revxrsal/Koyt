use crate::TauriRunningAppState;
use tauri::{AppHandle, Manager, RunEvent};

pub fn on_app_run(app_handle: &AppHandle, event: RunEvent) {
    match event {
        RunEvent::ExitRequested { .. } => {
            {
                let app_handle = app_handle.clone();
                tokio::spawn(async move {
                    let state: TauriRunningAppState = app_handle.state();
                    state.write().await.save_settings_now();
                });
            }
            #[cfg(target_os = "macos")]
            {
                crate::platform::macos::set_dock_visible(true);
            }
            for (_label, window) in app_handle.webview_windows() {
                window.close().unwrap();
            }
        }
        _ => {}
    }
}
