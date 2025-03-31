pub mod settings;
pub mod setup;
pub mod window;
pub mod keybind;

use settings::commands::*;
use std::sync::Arc;
use tauri::State;

use crate::settings::running_app_state::RunningAppState;
use tauri_specta::{collect_commands, collect_events, ErrorHandlingMode};
use tokio::sync::RwLock;

pub type TauriRunningAppState<'a> = State<'a, Arc<RwLock<RunningAppState>>>;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri_specta::Builder::<tauri::Wry>::new()
        // Then register them (separated by a comma)
        .commands(collect_commands![get_settings, set_settings,])
        .events(collect_events![])
        .error_handling(ErrorHandlingMode::Throw);

    #[cfg(debug_assertions)] // <- Only export on non-release builds
    builder
        .export(
            specta_typescript::Typescript::default().header("// @ts-ignore"),
            "../src/gen/bindings.ts",
        )
        .expect("Failed to export typescript bindings");

    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(builder.invoke_handler())
        .setup(move |app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            builder.mount_events(app);
            setup::setup(app)
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
