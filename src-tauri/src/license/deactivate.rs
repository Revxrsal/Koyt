use crate::license::errors::ClientError;
use crate::license::types::{LSResult, LicenseKey, LicenseMeta};
use crate::license::LemonSqueezyClient;
use crate::response_to_result;
use reqwest::header::ACCEPT;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct DeactivateLicense {
    pub deactivated: bool,
    pub error: Option<String>,
    pub license_key: LicenseKey,
    pub meta: LicenseMeta,
}

pub trait DeactivateLicenseExt {
    async fn deactivate_license(
        &self,
        key: impl Into<String>,
        instance_id: impl Into<String>,
    ) -> LSResult<DeactivateLicense>;
}

impl DeactivateLicenseExt for LemonSqueezyClient {
    async fn deactivate_license(
        &self,
        key: impl Into<String>,
        instance_id: impl Into<String>,
    ) -> LSResult<DeactivateLicense> {
        let response = self
            .http_client()
            .post("https://api.lemonsqueezy.com/v1/licenses/deactivate")
            .header(ACCEPT, "application/json")
            .form(&[
                ("license_key", key.into()),
                ("instance_id", instance_id.into()),
            ])
            .send()
            .await
            .map_err(|v| ClientError::RequestError(v))?;
        let resp: serde_json::Value = response
            .json()
            .await
            .map_err(|v| ClientError::RequestError(v))?;
        response_to_result!(resp)
    }
}
