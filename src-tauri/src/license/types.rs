use crate::license::errors::ClientError;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

pub type LSResult<T> = Result<T, ClientError>;

#[derive(Serialize, Deserialize, Debug)]
pub struct LicenseMeta {
    pub store_id: i64,
    pub order_id: i64,
    pub order_item_id: i64,
    pub variant_id: i64,
    pub variant_name: String,
    pub product_id: i64,
    pub product_name: String,
    pub customer_id: i64,
    pub customer_name: String,
    pub customer_email: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct LicenseKey {
    pub id: i64,
    pub status: LicenseStatus,
    pub key: String,
    pub activation_limit: i64,
    pub activation_usage: i64,
    pub created_at: String,
    pub expires_at: Option<DateTime<Utc>>,
}

impl LicenseKey {
    pub fn is_active(&self) -> bool {
        matches!(self.status, LicenseStatus::Active)
    }
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "snake_case")]
pub enum LicenseStatus {
    Inactive,
    Active,
    Expired,
    Disabled,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct LicenseInstance {
    pub id: String,
    pub name: String,
    pub created_at: String,
}
