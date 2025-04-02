use serde::{Deserialize, Serialize};
use crate::action::VideoAction;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum Message {
    LaunchApp,
    ExecuteAction {
        action: VideoAction
    }
}

