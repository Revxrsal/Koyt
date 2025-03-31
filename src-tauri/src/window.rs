use tauri::{AppHandle, Manager};

pub fn open_main_window(app_handle: &AppHandle) {
    let window = if let Some(window) = app_handle.get_webview_window("main") {
        window
    } else {
        let url = tauri::WebviewUrl::default();
        tauri::WebviewWindowBuilder::new(app_handle, "main", url)
            .title("Keyboard-operated YouTube")
            .inner_size(1100.0, 600.0)
            .center()
            .browser_extensions_enabled(true)
            .resizable(true)
            .visible(true)
            .fullscreen(false)
            .build()
            .unwrap()
    };

    window.show().unwrap();
    window.set_focus().unwrap();
}
