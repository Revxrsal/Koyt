#![allow(async_fn_in_trait)]

pub mod chrome;
pub mod cli;
pub mod encryption;
pub mod event;
pub mod ipc;
pub mod keybind;
pub mod license;
pub mod platform;
pub mod runtime;
pub mod settings;
pub mod setup;
pub mod tray;
pub mod utils;
pub mod window;

use keybind::commands::*;
use license::commands::*;
use log::LevelFilter;
use settings::commands::*;
use std::sync::Arc;
use tauri::State;
use utils::commands::*;

use crate::settings::running_app_state::RunningAppState;
use crate::window::open_main_window;
use tauri_specta::{collect_commands, collect_events, ErrorHandlingMode};
use tokio::sync::RwLock;

pub type TauriRunningAppState<'a> = State<'a, Arc<RwLock<RunningAppState>>>;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    let builder = tauri_specta::Builder::<tauri::Wry>::new()
        // Then register them (separated by a comma)
        .commands(collect_commands![
            get_settings,
            set_settings,
            to_tauri_global_shortcut,
            register_keybind_to_system,
            get_failed_key_binds,
            open_url,
            reveal_file,
            get_system_fonts,
            get_latest_version,
            failed_to_register_hosts,
            input_license,
            has_license,
            renew_app_license,
            deactivate_instance
        ])
        .events(collect_events![
            event::client::ClientConnectedEvent,
            event::client::ClientDisconnectedEvent,
        ])
        .error_handling(ErrorHandlingMode::Result);

    #[cfg(debug_assertions)] // <- Only export on non-release builds
    builder
        .export(
            specta_typescript::Typescript::default().header("// @ts-ignore"),
            "../src/gen/bindings.ts",
        )
        .expect("Failed to export typescript bindings");

    let app = tauri::Builder::default();

    #[cfg(not(debug_assertions))]
    let app = app.plugin(tauri_plugin_autostart::init(
        tauri_plugin_autostart::MacosLauncher::LaunchAgent,
        Some(vec!["--minimized"]),
    ));

    let app = app
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            open_main_window(app);
        }))
        .plugin(
            tauri_plugin_log::Builder::default()
                .level(LevelFilter::Debug)
                .build(),
        )
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(builder.invoke_handler())
        .setup(move |app| {
            builder.mount_events(app);
            setup::setup(app)
        });
    let res = app.build(tauri::generate_context!());
    match res {
        Ok(app) => {
            app.run(runtime::on_app_run);
        }
        Err(why) => {
            native_dialog::MessageDialog::new()
                .set_type(native_dialog::MessageType::Error)
                .set_title("Failed to start Keyboard-Operated YouTube")
                .set_text(&format!("Error: {:?}", why))
                .show_alert()
                .unwrap();
        }
    }
}
