use crate::extensions::{PlatformExtensionManager, SystemExtensionManager};
use std::fs;
use std::fs::File;
use std::path::PathBuf;
use tauri::path::BaseDirectory;
use tauri::{AppHandle, Manager, WebviewWindow};
use zip::ZipArchive;

pub fn open_main_window(app_handle: &AppHandle) {
    let extensions_path = app_handle
        .path()
        .resolve("extensions", BaseDirectory::Resource)
        .unwrap();

    let window = if let Some(window) = app_handle.get_webview_window("main") {
        window
    } else {
        let url = tauri::WebviewUrl::default();
        tauri::WebviewWindowBuilder::new(app_handle, "main", url)
            .title("Oxide | Minimalist video player")
            .inner_size(1100.0, 600.0)
            .center()
            .browser_extensions_enabled(true)
            // .extensions_path(extensions_path)
            .resizable(true)
            .visible(true)
            .fullscreen(false)
            .build()
            .unwrap()
    };
    if extensions_path.exists() {
        extract_all_zip_files(&extensions_path, &window);
    }
    window.show().unwrap();
    window.set_focus().unwrap();
}

fn extract_all_zip_files(dir: &PathBuf, window: &WebviewWindow) {
    let mut extensions = vec![];
    for entry in fs::read_dir(dir).unwrap() {
        if let Ok(entry) = entry {
            let path = entry.path();

            if path.extension().and_then(|s| s.to_str()) == Some("zip") {
                extensions.push(path.file_stem().unwrap().to_str().unwrap().to_owned());
                extract_zip(dir, &path, window);
            }
        }
    }
}

fn extract_zip(dir: &PathBuf, path: &PathBuf, window: &WebviewWindow) {
    let file_stem = path.file_stem().and_then(|s| s.to_str()).unwrap_or("");
    let target_folder = dir.join(file_stem);
    if target_folder.exists() {
        println!("Skipping '{}', folder already exists.", file_stem);
        return;
    }
    println!(
        "Extracting '{}' to '{}'",
        path.display(),
        target_folder.display()
    );
    fs::create_dir_all(&target_folder).unwrap();
    let file = File::open(&path).unwrap();
    let mut archive = ZipArchive::new(file).unwrap();
    archive.extract(&target_folder).unwrap();

    SystemExtensionManager::add_extension(window.as_ref(), PathBuf::from(target_folder)).unwrap();
}
