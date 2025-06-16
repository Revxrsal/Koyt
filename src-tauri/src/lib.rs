pub mod cli;
pub mod ipc;
pub mod keybind;
pub mod settings;
pub mod setup;
pub mod tray;
pub mod window;
pub mod runtime;
pub mod platform;
pub mod chrome;

use keybind::commands::*;
use settings::commands::*;
use std::sync::Arc;
use log::LevelFilter;
use tauri::State;

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
            open_url
        ])
        .events(collect_events![])
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
        .plugin(tauri_plugin_log::Builder::default().level(
            LevelFilter::Debug
        ).build())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(builder.invoke_handler())
        .setup(move |app| {
            builder.mount_events(app);
            setup::setup(app)
        });
    app.build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(runtime::on_app_run);
}
