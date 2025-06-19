use std::collections::HashMap;
use crate::settings::persist::{read_settings, save_settings};
use crate::settings::AppSettings;
use std::sync::Arc;
use std::time::Duration;
use tauri::AppHandle;
use tokio::sync::RwLock;
use tokio::task::JoinHandle;
use tokio::time::sleep;

#[derive(Debug)]
pub struct RunningAppState {
    settings: AppSettings,
    app_handle: AppHandle,
    next_saving_task: Option<JoinHandle<()>>,
    failed_keybinds: HashMap<i32, String>
}

impl RunningAppState {
    pub fn load(app_handle: &AppHandle) -> Self {
        let app_settings = read_settings(app_handle).unwrap_or_default();
        RunningAppState {
            app_handle: app_handle.clone(),
            settings: app_settings,
            next_saving_task: None,
            failed_keybinds: HashMap::new(),
        }
    }

    pub fn settings(&self) -> &AppSettings {
        &self.settings
    }

    pub fn settings_mut(&mut self) -> &mut AppSettings {
        &mut self.settings
    }

    pub fn app_handle(&self) -> &AppHandle {
        &self.app_handle
    }

    pub async fn schedule_saving(state: Arc<RwLock<RunningAppState>>) {
        let mut current = state.write().await;
        if let Some(task) = current.next_saving_task.take() {
            task.abort();
        }
        let state = state.clone();
        let saving_task = tokio::spawn(async move {
            sleep(Duration::from_secs(SAVING_DEBOUNCE_SECONDS)).await;
            let mut state = state.write().await;
            save_settings(&state.settings, &state.app_handle).unwrap();
            state.next_saving_task = None;
        });
        current.next_saving_task = Some(saving_task);
    }

    pub fn save_settings_now(&mut self) {
        if let Some(task) = self.next_saving_task.take() {
            task.abort();
            save_settings(&self.settings, &self.app_handle).unwrap();
        }
    }

    pub fn failed_keybinds(&self) -> &HashMap<i32, String> {
        &self.failed_keybinds
    }
    
    pub fn failed_keybinds_mut(&mut self) -> &mut HashMap<i32, String> {
        &mut self.failed_keybinds
    }
}

const SAVING_DEBOUNCE_SECONDS: u64 = 2;
