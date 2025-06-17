use crate::license::encryption::encryptor;
use chrono::{DateTime, Duration, Utc};
use serde::{Deserialize, Serialize};
use std::fs;
use tauri::{AppHandle, Manager};

#[derive(Serialize, Deserialize, Debug)]
pub struct SecureLicenseStore {
    license_key: String,
    instance_id: String,
    last_refresh: DateTime<Utc>,
    is_revoked: bool,
}

impl SecureLicenseStore {
    pub fn new(license_key: String, instance_id: String, last_refresh: DateTime<Utc>) -> Self {
        Self {
            license_key,
            instance_id,
            last_refresh,
            is_revoked: false,
        }
    }

    pub fn delete(app_handle: &AppHandle) -> anyhow::Result<()> {
        let mut license_dat = app_handle.path().app_data_dir()?;
        license_dat.push("license.dat");
        if license_dat.exists() {
            return Ok(());
        }
        fs::remove_file(&license_dat)?;
        Ok(())
    }

    pub fn load(app_handle: &AppHandle) -> anyhow::Result<Option<SecureLicenseStore>> {
        let mut license_dat = app_handle.path().app_data_dir()?;
        let _ = fs::create_dir_all(&license_dat);
        license_dat.push("license.dat");
        if license_dat.exists() {
            let content = fs::read(license_dat)?;
            let content = encryptor().decrypt(content.as_slice())?;
            let result: SecureLicenseStore = serde_json::from_slice(content.as_slice())?;
            if result.is_expired() || result.is_revoked() {
                return Ok(None);
            }
            Ok(Some(result))
        } else {
            Ok(None)
        }
    }

    pub fn save(&self, app_handle: &AppHandle) -> anyhow::Result<()> {
        let mut license_dat = app_handle.path().app_data_dir()?;
        license_dat.push("license.dat");
        let content = serde_json::to_vec(self)?;
        let content = encryptor().encrypt(content.as_slice())?;
        fs::write(&license_dat, content)?;
        Ok(())
    }

    pub fn license_key(&self) -> &str {
        &self.license_key
    }

    pub fn last_refresh(&self) -> DateTime<Utc> {
        self.last_refresh
    }

    pub fn instance_id(&self) -> &str {
        &self.instance_id
    }

    pub fn is_expired(&self) -> bool {
        let now = Utc::now();
        (now - self.last_refresh()) >= Duration::days(7)
    }

    pub fn is_revoked(&self) -> bool {
        self.is_revoked
    }

    pub fn set_revoked(&mut self, is_revoked: bool) {
        self.is_revoked = is_revoked;
    }
}
