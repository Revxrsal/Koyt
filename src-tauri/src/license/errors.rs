use std::error::Error;
use std::fmt::{Debug, Display, Formatter};

const KEY_NOT_FOUND: &'static str = "license_key not found.";
const INSTANCE_NOT_FOUND: &'static str = "instance_id not found.";
const MAX_ACTIVE_LIMIT: &'static str = "This license key has reached the activation limit.";

pub enum ClientError {
    RequestError(reqwest::Error),
    ApiError(String),
}

impl Debug for ClientError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            ClientError::RequestError(err) => Debug::fmt(&err, f),
            ClientError::ApiError(err) => Debug::fmt(&err, f)
        }
    }
}

impl Display for ClientError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            ClientError::RequestError(err) => Display::fmt(&err, f),
            ClientError::ApiError(err) => Display::fmt(&err, f)
        }
    }
}

impl Error for ClientError {}

impl ClientError {
    pub fn from_api_error(err: String) -> ClientError {
        ClientError::ApiError(map_api_error(&err))
    }
}

pub fn map_api_error(err: &str) -> String {
    match err {
        KEY_NOT_FOUND => "Invalid license key".into(),
        INSTANCE_NOT_FOUND => "Invalid instance ID".into(),
        MAX_ACTIVE_LIMIT => format!("{} Please contact support to increase your activation limit", MAX_ACTIVE_LIMIT),
        _ => format!("API responded with error: {}. Please contact support.", err)
    }
}
