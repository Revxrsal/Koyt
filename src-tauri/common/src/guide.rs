use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct MessageHostGuide {
    pub app_exe_path: PathBuf,
}
