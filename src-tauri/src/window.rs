use tauri::{AppHandle, Manager};
use tauri::path::BaseDirectory;

pub fn open_main_window(app_handle: &AppHandle) {
    // The path specified must follow the same syntax as defined in
    // `tauri.conf.json > bundle > resources`
    let extensions_path = app_handle.path().resolve("extensions", BaseDirectory::Resource).unwrap();
    println!("{}", extensions_path.display());
    let window = if let Some(window) = app_handle.get_webview_window("main") {
        window
    } else {
        let url = tauri::WebviewUrl::default();
        tauri::WebviewWindowBuilder::new(app_handle, "main", url)
            .title("Oxide | Minimalist video player")
            .inner_size(1100.0, 600.0)
            .center()
            .browser_extensions_enabled(true)
            .extensions_path(extensions_path)
            .resizable(true)
            .visible(false)
            .fullscreen(false)
            .build()
            .unwrap()
    };
    window.show().unwrap();
    window.set_focus().unwrap();
}
