use crate::license::handler::LicenseHandler;
use specta::specta;
use tauri::{command, AppHandle, Manager, State};
use tokio::sync::Mutex;

#[command]
#[specta]
pub async fn input_license<'a>(
    license_key: String,
    instance_id: String,
    license_handler: State<'a, Mutex<LicenseHandler>>,
) -> Result<bool, String> {
    let mut license_handler = license_handler.lock().await;
    license_handler
        .set_license(license_key, instance_id)
        .await
        .map_err(|err| err.to_string())
}

#[command]
#[specta]
pub async fn has_license<'a>(
    license_handler: State<'a, Mutex<LicenseHandler>>,
) -> Result<bool, String> {
    let license_handler = license_handler.lock().await;
    if let Some(license) = license_handler.license_store() {
        return Ok(!license.is_revoked() && !license.is_expired());
    }
    Ok(false)
}

#[command]
#[specta]
pub async fn renew_app_license<'a>(
    handle: AppHandle,
    license_handler: State<'a, Mutex<LicenseHandler>>,
) -> Result<bool, ()> {
    let license_handler = license_handler.lock().await;
    if let Some(license) = license_handler.license_store() {
        if license.is_revoked() || license.is_expired() {
            return Ok(false);
        }
        {
            let handle = handle.clone();
            tokio::spawn(async move {
                let license_handler: State<'_, Mutex<LicenseHandler>> = handle.state();
                let mut handler = license_handler.lock().await;
                handler.refresh_silently().await;
            });
        }
        return Ok(true);
    }
    Ok(false)
}

#[command]
#[specta]
pub async fn deactivate_instance<'a>(
    license_handler: State<'a, Mutex<LicenseHandler>>,
) -> Result<(), String> {
    let mut license_handler = license_handler.lock().await;
    license_handler
        .deactivate()
        .await
        .map_err(|err| err.to_string())
}
