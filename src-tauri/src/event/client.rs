use serde::{Deserialize, Serialize};
use specta::Type;
use tauri_specta::Event;

#[derive(Event, Serialize, Deserialize, Type, Debug, Clone)]
pub struct ClientConnectedEvent {
    pub total_count: u32,
}

#[derive(Event, Serialize, Deserialize, Type, Debug, Clone)]
pub struct ClientDisconnectedEvent {
    pub total_count: u32,
}
