use crate::cli::Args;
use crate::ipc::{dispatch_hotkey, start_ipc_server};
use crate::settings::running_app_state::RunningAppState;
use crate::settings::AppSettings;
use crate::tray::create_tray;
use crate::window::open_main_window;
use clap::Parser;
use common::hotkey::HotKey;
use std::sync::Arc;
use tauri::{App, AppHandle, Manager};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, ShortcutState};
use tokio::sync::RwLock;

pub fn setup(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    let handle = app.handle().clone();
    let app_state = RunningAppState::load(&handle);
    #[cfg(not(debug_assertions))]
    {
        use tauri_plugin_autostart::ManagerExt;
        let autostart_manager = app.autolaunch();
        if app_state.settings().launch_on_startup() {
            let _ = autostart_manager.enable();
        } else {
            let _ = autostart_manager.disable();
        }
    }

    register_global_shortcuts(&handle, app_state.settings());
    let app_state = Arc::new(RwLock::new(app_state));
    handle.manage(app_state);
    tokio::spawn(async move {
        start_ipc_server().await.unwrap();
    });
    create_tray(&app)?;

    let args = Args::parse();
    open_main_window(app.app_handle(), args.minimized);

    Ok(())
}

fn register_global_shortcuts(handle: &AppHandle, settings: &AppSettings) {
    for x in settings.hotkeys() {
        register_keybind(handle, x);
    }
}

pub fn register_keybind(handle: &AppHandle, target: &HotKey) {
    let plugin = handle.global_shortcut();
    let id = target.id();
    let shortcut = target.keybind().to_tauri_shortcut();
    if shortcut.is_empty() {
        return;
    }
    plugin
        .on_shortcut(shortcut.as_str(), move |app, _shortcut, event| {
            if matches!(event.state, ShortcutState::Pressed) {
                let app = app.clone();
                tokio::spawn(async move {
                    let state = app.state::<Arc<RwLock<RunningAppState>>>();
                    let running_app_state = state.read().await;
                    for hotkey in running_app_state.settings().hotkeys() {
                        if hotkey.id() == id {
                            dispatch_hotkey(&hotkey).await;
                        }
                    }
                });
            }
        })
        .unwrap();
}
