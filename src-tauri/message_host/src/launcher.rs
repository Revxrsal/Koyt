use std::path::Path;

use crate::show_error;
use opener::open;

pub fn launch_app() {
    tokio::spawn(async move {
        #[cfg(target_os = "windows")]
        {
            let app_file = Path::new("KbYouTube.exe");
            if let Err(why) = open(&app_file) {
                let err_str = why.to_string();
                show_error("Failed to launch app from extension", &err_str);
            }
        }
        #[cfg(target_os = "macos")]
        {
            let home_dir = dirs_next::home_dir().unwrap();
            let app_file = home_dir.join("Applications").join("KbYouTube.app");
            if let Err(why) = open(&app_file) {
                let err_str = why.to_string();
                show_error("Failed to launch app from extension", &err_str);
            }
        }
        #[cfg(target_os = "linux")]
        {
            let home_dir = dirs_next::home_dir().unwrap();
            let app_file = home_dir.join("Applications").join("KbYouTube.app");
            if let Err(why) = open(&app_file) {
                let err_str = why.to_string();
                show_error("Failed to launch app from extension", &err_str);
            }
        }
    });
}
