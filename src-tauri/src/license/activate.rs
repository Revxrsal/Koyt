
use crate::license::errors::ClientError;
use crate::license::types::{LSResult, LicenseInstance, LicenseKey, LicenseMeta};
use crate::license::LemonSqueezyClient;
use crate::response_to_result;
use reqwest::header::ACCEPT;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct ActivateLicense {
    pub activated: bool,
    pub license_key: LicenseKey,
    pub instance: LicenseInstance,
    pub meta: LicenseMeta,
}

pub trait ActivateLicenseExt {
    async fn activate_license(
        &self,
        key: impl Into<String>,
        instance_name: impl Into<String>,
    ) -> LSResult<ActivateLicense>;
}

impl ActivateLicenseExt for LemonSqueezyClient {
    async fn activate_license(
        &self,
        key: impl Into<String>,
        instance_name: impl Into<String>,
    ) -> LSResult<ActivateLicense> {
        let response = self
            .http_client()
            .post("https://api.lemonsqueezy.com/v1/licenses/activate")
            .header(ACCEPT, "application/json")
            .form(&[
                ("license_key", key.into()),
                ("instance_name", instance_name.into()),
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
