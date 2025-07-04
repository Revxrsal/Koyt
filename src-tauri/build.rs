use std::path::Path;
use std::process::Command;
use std::{env, fs};

fn main() {
    println!("cargo:rerun-if-changed=message_host/src");
    println!("cargo:rerun-if-changed=message_host/Cargo.toml");
    let directory = env::var("CARGO_MANIFEST_DIR").unwrap();
    let message_host = Path::new(&directory).join("message_host");
    let target_triple = env::var("TARGET").unwrap();

    // Build the 'message_host' crate
    let status = if cfg!(feature = "ms-store") {
        Command::new("cargo")
            .current_dir(&message_host)
            .args(&["build", "--release", "--features", "ms-store"])
            .status()
            .expect("Failed to build message_host crate")
    } else {
        Command::new("cargo")
            .current_dir(&message_host)
            .args(&["build", "--release"])
            .status()
            .expect("Failed to build message_host crate")
    };
    
    if !status.success() {
        panic!("Building message_host failed");
    }

    let build_dir = message_host.join("target").join("release");

    #[cfg(target_os = "windows")]
    let message_host_exe = build_dir.join("message_host.exe");

    #[cfg(not(target_os = "windows"))]
    let message_host_exe = build_dir.join("message_host");

    #[cfg(target_os = "windows")]
    let host_exe = build_dir.join(format!("message_host-{}.exe", target_triple));

    #[cfg(not(target_os = "windows"))]
    let host_exe = build_dir.join(format!("message_host-{}", target_triple));

    if message_host_exe.exists() {
        if let Err(e) = fs::rename(&message_host_exe, &host_exe) {
            panic!("failed to rename executable: {}", e);
        }
    } else {
        panic!("message_host wasn't built.")
    }

    tauri_build::build()
}
