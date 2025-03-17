use crate::commands::TauriRunningAppState;
use crate::extensions::version::{Arch, ChromeVersion};
use crate::extensions::{BrowserExtension, PlatformExtensionManager, SystemExtensionManager};
use specta::specta;
use tauri::{command, Manager};

#[command]
#[specta]
pub async fn download_extension<'a>(
    url: String,
    chrome_version: ChromeVersion,
    arch: Arch,
    state: TauriRunningAppState<'a>,
) -> Result<BrowserExtension, String> {
    let state = state.read().await;
    let directory = state
        .app_handle()
        .path()
        .app_data_dir()
        .unwrap()
        .join("browser-extensions");
    let manifest = crate::extensions::downloader::download_extension(
        url,
        &chrome_version,
        &arch,
        directory.clone(),
    )
    .await;
    println!("{:?}", manifest);
    if let Some(manifest) = manifest {
        let extension_dir = directory.join(&manifest.id());
        let extension = BrowserExtension::new(
            manifest.id(),
            manifest.name(),
            manifest.version(),
            manifest.description(),
            extension_dir.to_str().unwrap(),
        );
        for (_, window) in state.app_handle().webview_windows() {
            SystemExtensionManager::add_extension(window.as_ref(), extension_dir.clone()).unwrap();
        }
        Ok(extension)
    } else {
        Err(String::from("Invalid extension."))
    }
}

#[command]
#[specta]
pub async fn set_extension_enabled<'a>(
    state: TauriRunningAppState<'a>,
    extension_name: &str,
    enabled: bool,
) -> Result<(), ()> {
    let state = state.read().await;
    let windows = state.app_handle().webview_windows();
    for webview in windows.values() {
        SystemExtensionManager::set_extension_enabled(webview.as_ref(), extension_name, enabled)
            .unwrap();
    }
    Ok(())
}

#[command]
#[specta]
pub async fn remove_extension<'a>(
    state: TauriRunningAppState<'a>,
    extension_name: &str,
) -> Result<(), ()> {
    let state = state.read().await;
    let windows = state.app_handle().webview_windows();
    for webview in windows.values() {
        SystemExtensionManager::remove_extension(webview.as_ref(), extension_name).unwrap();
    }
    Ok(())
}
