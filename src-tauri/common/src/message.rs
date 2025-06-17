use crate::action::VideoAction;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum Message {
    KeepAlive,
    LaunchApp,
    ExecuteAction { action: VideoAction },
}
