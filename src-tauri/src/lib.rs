pub mod commands;
pub mod extensions;
pub mod settings;
pub mod setup;
pub mod window;

use crate::commands::*;
use crate::extensions::commands::*;
use tauri_plugin_global_shortcut::ShortcutState;

use crate::setup::GlobalToggleEvent;
use tauri_specta::{collect_commands, collect_events, ErrorHandlingMode};
use tauri_specta::Event;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri_specta::Builder::<tauri::Wry>::new()
        // Then register them (separated by a comma)
        .commands(collect_commands![
            download_extension,
            remove_extension,
            set_extension_enabled,
            get_settings,
            set_settings
        ])
        .events(collect_events![GlobalToggleEvent])
        .error_handling(ErrorHandlingMode::Throw);

    #[cfg(debug_assertions)] // <- Only export on non-release builds
    builder
        .export(
            specta_typescript::Typescript::default().header("// @ts-ignore"),
            "../src/gen/bindings.ts",
        )
        .expect("Failed to export typescript bindings");

    tauri::Builder::default()
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_shortcuts(["ctrl+shift+c", "command+shift+c"]).unwrap()
                .with_handler(|app, _shortcut, event| {
                    if event.state == ShortcutState::Pressed {
                        GlobalToggleEvent.emit(app).unwrap()
                    }
                })
                .build(),
        )
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
