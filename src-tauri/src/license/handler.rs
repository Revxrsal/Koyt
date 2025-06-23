use crate::license::deactivate::DeactivateLicenseExt;
use crate::license::store::SecureLicenseStore;
use crate::license::types::LSResult;
use crate::license::validate::ValidateLicenseExt;
use crate::license::LemonSqueezyClient;
use chrono::Utc;
use reqwest::Client;
use tauri::AppHandle;
use crate::license::activate::ActivateLicenseExt;

const PRODUCT_ID: i64 = 548363;
const STORE_ID: i64 = 96287;

#[derive(Debug)]
pub struct LicenseHandler {
    app_handle: AppHandle,
    client: LemonSqueezyClient,
    license_store: Option<SecureLicenseStore>,
}

impl LicenseHandler {
    pub fn new(app_handle: AppHandle) -> Self {
        Self {
            client: LemonSqueezyClient::new(Client::new(), PRODUCT_ID, STORE_ID),
            license_store: SecureLicenseStore::load(&app_handle).unwrap(),
            app_handle,
        }
    }

    pub async fn set_license(
        &mut self,
        license_key: String,
        instance_id: String,
    ) -> LSResult<bool> {
        let activate = self.client()
            .activate_license(&license_key, &instance_id)
            .await?;
        if !self.client().is_our_product(&activate.meta) {
            return Ok(false);
        }
        if !activate.license_key.is_active() {
            return Ok(false);
        }
        let refreshed = SecureLicenseStore::new(license_key, instance_id, Utc::now());
        let _ = refreshed.save(self.app_handle());
        self.license_store = Some(refreshed);
        Ok(true)
    }

    pub async fn refresh_silently(&mut self) {
        if let Some(license) = self.license_store() {
            let now = Utc::now();
            if let Ok(validate) = self
                .client()
                .validate_license(license.license_key(), license.instance_id())
                .await
            {
                if !self.client().is_our_product(&validate.meta) {
                    return;
                }
                if !validate.license_key.is_active() {
                    if let Some(license) = &mut self.license_store {
                        license.set_revoked(true);
                    }
                    return;
                }
                let refreshed = SecureLicenseStore::new(
                    license.license_key().to_string(),
                    license.instance_id().to_string(),
                    now,
                );
                let _ = refreshed.save(self.app_handle());
                self.license_store = Some(refreshed);
            }
        }
    }

    pub async fn deactivate(&mut self) -> LSResult<()> {
        if let Some(license) = self.license_store.take() {
            self.client()
                .deactivate_license(license.license_key(), license.instance_id())
                .await?;
            SecureLicenseStore::delete(self.app_handle()).unwrap();
            return Ok(());
        }
        Ok(())
    }

    pub fn client(&self) -> &LemonSqueezyClient {
        &self.client
    }

    pub fn license_store(&self) -> &Option<SecureLicenseStore> {
        &self.license_store
    }

    pub fn app_handle(&self) -> &AppHandle {
        &self.app_handle
    }
}
