pub mod persist;
pub mod running_app_state;
pub mod commands;

use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Clone, Serialize, Deserialize, Debug, Type, Default)]
pub struct AppSettings {}

impl AppSettings {}
