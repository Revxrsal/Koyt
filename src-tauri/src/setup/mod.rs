use crate::cli::Args;
use crate::ipc::listener::{ActionHandle, IpcServer};
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
    let server = IpcServer::create()?;
    let action_handle = server.action_handle();
    handle.manage(server.action_handle());
    {
        tokio::spawn(async move {
            server.start().await;
        });
    }

    crate::chrome::register_host_to_chrome_apps(&handle);
    register_global_shortcuts(&handle, app_state.settings(), action_handle);
    let app_state = Arc::new(RwLock::new(app_state));
    handle.manage(app_state);

    create_tray(&app)?;

    let args = Args::parse();
    open_main_window(app.app_handle(), args.minimized);

    Ok(())
}

fn register_global_shortcuts(handle: &AppHandle, settings: &AppSettings, sender: ActionHandle) {
    for x in settings.hotkeys() {
        register_keybind(handle, x, sender.clone());
    }
}

pub fn register_keybind(handle: &AppHandle, target: &HotKey, action_dispatcher: ActionHandle) {
    let plugin = handle.global_shortcut();
    let id = target.id();
    let shortcut = target.keybind().to_tauri_shortcut();
    if shortcut.is_empty() {
        return;
    }
    plugin
        .on_shortcut(shortcut.as_str(), move |app, _shortcut, event| {
            let dispatcher = action_dispatcher.clone();
            if matches!(event.state, ShortcutState::Pressed) {
                let app = app.clone();
                tokio::spawn(async move {
                    let state = app.state::<Arc<RwLock<RunningAppState>>>();
                    let running_app_state = state.read().await;
                    for hotkey in running_app_state.settings().hotkeys() {
                        if hotkey.id() == id {
                            let action = hotkey.video_action().clone();
                            if let Err(err) = dispatcher.sender().send(action) {
                                println!("error sending hotkey via channel: {}", err);
                            }
                        }
                    }
                });
            }
        })
        .unwrap();
}
