use crate::settings::running_app_state::RunningAppState;
use crate::settings::AppSettings;
use crate::TauriRunningAppState;
use specta::specta;
use std::ops::Deref;
use std::sync::Arc;
use tauri::command;

#[command]
#[specta]
pub async fn get_settings<'a>(state: TauriRunningAppState<'a>) -> Result<AppSettings, ()> {
    let state = state.read().await;
    Ok(state.settings().clone())
}

#[command]
#[specta]
pub async fn set_settings<'a>(
    app_settings: AppSettings,
    state: TauriRunningAppState<'a>,
) -> Result<(), ()> {
    let mut current = state.write().await;
    #[cfg(not(any(debug_assertions, feature = "ms-store")))]
    if current.settings().launch_on_startup() != app_settings.launch_on_startup() {
        use tauri_plugin_autostart::ManagerExt;
        let autostart_manager = current.app_handle().autolaunch();
        if app_settings.launch_on_startup() {
            let _ = autostart_manager.enable();
        } else {
            let _ = autostart_manager.disable();
        }
    }
    *current.settings_mut() = app_settings;
    drop(current);

    RunningAppState::schedule_saving(Arc::clone(state.deref())).await;
    Ok(())
}
