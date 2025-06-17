use crate::license::types::LicenseMeta;
use reqwest::Client;

pub mod activate;
pub mod commands;
pub mod deactivate;
mod encryption;
pub mod errors;
pub mod handler;
pub mod store;
pub mod types;
pub mod validate;

#[derive(Debug)]
pub struct LemonSqueezyClient {
    http_client: Client,
    product_id: i64,
    store_id: i64,
}

impl LemonSqueezyClient {
    pub fn new(http_client: Client, product_id: i64, store_id: i64) -> Self {
        Self {
            http_client,
            product_id,
            store_id,
        }
    }

    pub fn product_id(&self) -> i64 {
        self.product_id
    }

    pub fn store_id(&self) -> i64 {
        self.store_id
    }

    pub fn http_client(&self) -> &Client {
        &self.http_client
    }

    pub fn is_our_product(&self, meta: &LicenseMeta) -> bool {
        self.product_id == meta.product_id && self.store_id == meta.store_id
    }
}

#[macro_export]
macro_rules! response_to_result {
    ($result:ident) => {
        if let Some(error) = $result.get("error") {
            if let Some(error) = error.as_str() {
                Err(ClientError::from_api_error(error.into()))
            } else {
                Ok(serde_json::from_value($result).unwrap())
            }
        } else {
            Ok(serde_json::from_value($result).unwrap())
        }
    };
}
