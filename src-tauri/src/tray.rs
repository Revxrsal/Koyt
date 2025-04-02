use std::error::Error;

use tauri::menu::{Menu, MenuItem};
use tauri::tray::TrayIconBuilder;
use tauri::App;

pub fn create_tray(app: &App) -> Result<(), Box<dyn Error>> {
    let exit_i = MenuItem::with_id(app, "exit", "Exit", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&exit_i])?;

    TrayIconBuilder::new()
        .menu(&menu)
        .show_menu_on_left_click(true)
        .icon(app.default_window_icon().unwrap().clone())
        .on_menu_event(|app, event| match event.id.as_ref() {
            "exit" => app.exit(0),
            _ => println!("menu item {:?} not handled", event.id),
        })
        .build(app)?;

    Ok(())
}
