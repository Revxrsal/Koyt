use std::error::Error;

use crate::window::open_main_window;
use tauri::menu::{Menu, MenuItem};
use tauri::tray::{MouseButton, TrayIconBuilder, TrayIconEvent};
use tauri::App;

pub fn create_tray(app: &App) -> Result<(), Box<dyn Error>> {
    let exit_i = MenuItem::with_id(app, "exit", "Exit", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&exit_i])?;
    TrayIconBuilder::new()
        .menu(&menu)
        .icon(app.default_window_icon().unwrap().clone())
        .on_tray_icon_event(|tray, event| match event {
            TrayIconEvent::Click { button, .. } | TrayIconEvent::DoubleClick { button, .. } => {
                if matches!(button, MouseButton::Left) { 
                    let app = tray.app_handle();
                    open_main_window(app, false);
                }
            }
            _ => {}
        })
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "exit" => app.exit(0),
            _ => println!("menu item {:?} not handled", event.id),
        })
        .build(app)?;

    Ok(())
}
