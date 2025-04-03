use std::path::{absolute, Path};

use opener::open;

pub fn launch_app() {
    #[cfg(target_os = "windows")]
    {
        let app_file = absolute(Path::new("Koyt")).unwrap();
        if let Err(why) = open(&app_file) {
            // println!("Failed to open app: {:?}", why);
        }
    }
    #[cfg(target_os = "macos")]
    {
        let home_dir = dirs_next::home_dir().unwrap();
        let app_file = home_dir.join("Applications").join("Koyt.app");
        open(&app_file).unwrap();
    }
}
