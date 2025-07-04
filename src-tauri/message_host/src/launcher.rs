use crate::show_error;
use common::guide::MessageHostGuide;
use opener::open;
use std::fs::File;

pub fn launch_app() {
    tokio::spawn(async move {
        #[cfg(target_os = "windows")]
        {
            #[cfg(feature = "ms-store")]
            {
                use std::os::windows::process::CommandExt;
                use std::process::Command;
                const CREATE_NO_WINDOW: u32 = 0x08000000;
                const DETACHED_PROCESS: u32 = 0x00000008;
                let launch_result = Command::new("cmd")
                    .args([
                        "/C",
                        "start",
                        "",
                        "shell:AppsFolder\\AliAl-Kasasbeh.Keyboard-OperatedYouTube_bqqh6z0a8n85a!KBYOUTUBE",
                    ])
                    .creation_flags(DETACHED_PROCESS | CREATE_NO_WINDOW)
                    .spawn();
                if let Err(why) = launch_result {
                    show_error("Failed to launch app", &why.to_string());
                }
            }
            #[cfg(not(feature = "ms-store"))]
            {
                let guide_file = read_guide_file();
                if let Some(guide_file) = guide_file {
                    if let Err(why) = open(&guide_file.app_exe_path) {
                        let err_str = why.to_string();
                        show_error("Failed to launch app from extension", &err_str);
                    }
                } else {
                    show_error(
                        "Failed to launch app",
                        "host_guide.json does not exist. Did you launch the app at least for once?",
                    );
                }
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

fn read_guide_file() -> Option<MessageHostGuide> {
    if let Ok(file) = File::open("host_guide.json") {
        if let Ok(guide) = serde_json::from_reader(file) {
            return Some(guide);
        }
    }
    None
}
