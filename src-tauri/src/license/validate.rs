use reqwest::header::ACCEPT;
use crate::license::types::{LSResult, LicenseInstance, LicenseKey, LicenseMeta};
use crate::license::LemonSqueezyClient;
use serde::{Deserialize, Serialize};
use crate::license::errors::ClientError;
use crate::response_to_result;

#[derive(Serialize, Deserialize, Debug)]
pub struct ValidateLicense {
    pub valid: bool,
    pub license_key: LicenseKey,
    pub instance: LicenseInstance,
    pub meta: LicenseMeta,
}

pub trait ValidateLicenseExt {
    async fn validate_license(
        &self,
        id: impl Into<String>,
        instance_id: impl Into<String>,
    ) -> LSResult<ValidateLicense>;
}

impl ValidateLicenseExt for LemonSqueezyClient {
    async fn validate_license(&self, license_key: impl Into<String>, instance_id: impl Into<String>) -> LSResult<ValidateLicense> {
        let response = self.http_client()
            .post("https://api.lemonsqueezy.com/v1/licenses/validate")
            .header(ACCEPT, "application/json")
            .form(&[
                ("license_key", license_key.into()),
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