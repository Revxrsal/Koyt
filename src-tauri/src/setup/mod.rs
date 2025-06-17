use crate::cli::Args;
use crate::ipc::listener::{ActionHandle, IpcServer};
use crate::settings::running_app_state::RunningAppState;
use crate::settings::AppSettings;
use crate::tray::create_tray;
use crate::window::open_main_window;
use clap::Parser;
use common::hotkey::HotKey;
use common::message::Message;
use std::sync::Arc;
use tauri::{App, AppHandle, Manager};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, ShortcutState};
use tokio::sync::{Mutex, RwLock};
use crate::license::handler::LicenseHandler;

type ShortcutErr = tauri_plugin_global_shortcut::Error;

pub fn setup(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    setup_stronghold(app)?;
    let handle = app.handle().clone();
    let app_state = RunningAppState::load(&handle);
    let license = Mutex::new(LicenseHandler::new(app.handle().clone()));
    handle.manage(license);
    
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
    register_global_shortcuts(&handle, app_state.settings(), action_handle).unwrap();
    let app_state = Arc::new(RwLock::new(app_state));
    handle.manage(app_state);

    create_tray(&app)?;

    let args = Args::parse();
    if !args.minimized {
        open_main_window(app.app_handle());
    }

    Ok(())
}

fn setup_stronghold(app: &mut App) -> tauri::Result<()> {
    let salt_path = app
        .path()
        .app_local_data_dir()
        .expect("could not resolve app local data path")
        .join("peppery-salt.txt");
    app.handle()
        .plugin(tauri_plugin_stronghold::Builder::with_argon2(&salt_path).build())
}

fn register_global_shortcuts(
    handle: &AppHandle,
    settings: &AppSettings,
    sender: ActionHandle,
) -> Result<(), ShortcutErr> {
    for x in settings.hotkeys() {
        register_keybind(handle, x, sender.clone())?;
    }
    Ok(())
}

pub fn register_keybind(
    handle: &AppHandle,
    target: &HotKey,
    action_dispatcher: ActionHandle,
) -> Result<(), ShortcutErr> {
    let plugin = handle.global_shortcut();
    let id = target.id();
    let shortcut = target.keybind().to_tauri_shortcut();
    if shortcut.is_empty() {
        return Ok(());
    }
    plugin.on_shortcut(shortcut.as_str(), move |app, _shortcut, event| {
        let dispatcher = action_dispatcher.clone();
        if matches!(event.state, ShortcutState::Pressed) {
            let app = app.clone();
            tokio::spawn(async move {
                let state = app.state::<Arc<RwLock<RunningAppState>>>();
                let running_app_state = state.read().await;
                for hotkey in running_app_state.settings().hotkeys() {
                    if hotkey.id() == id {
                        let action = hotkey.video_action().clone();
                        let message = Message::ExecuteAction { action };
                        if let Err(err) = dispatcher.sender().send(message) {
                            println!("error sending hotkey via channel: {}", err);
                        }
                    }
                }
            });
        }
    })
}
