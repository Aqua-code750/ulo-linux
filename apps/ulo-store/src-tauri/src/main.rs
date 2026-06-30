// a) Purpose: Rust backend for the Ulo Store GUI.
// c) Install/Test: `cd apps/ulo-store && cargo tauri dev`
// d) Open decisions: Uses `std::process::Command` to wrap `pacman` and `flatpak`. For production, it should use DBus API for `ulo-pkgd`.

#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::process::Command;

#[tauri::command]
fn install_package(package_name: &str, source: &str) -> String {
    println!("Ulo Store: Installing {} from {}", package_name, source);
    
    let result = if source == "flatpak" {
        Command::new("flatpak")
            .args(["install", "-y", "flathub", package_name])
            .output()
    } else {
        // Default to pacman (via polkit wrapper 'pkexec')
        Command::new("pkexec")
            .args(["pacman", "-S", "--noconfirm", package_name])
            .output()
    };

    match result {
        Ok(output) => {
            if output.status.success() {
                String::from_utf8_lossy(&output.stdout).to_string()
            } else {
                String::from_utf8_lossy(&output.stderr).to_string()
            }
        }
        Err(err) => format!("Failed to execute installation: {}", err),
    }
}

#[tauri::command]
fn check_updates() -> String {
    // Simulating update check
    "5 updates available (Linux Kernel, Ulo Browser, Mesa, Steam, Discord)".to_string()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![install_package, check_updates])
        .run(tauri::generate_context!())
        .expect("error while running Ulo Store application");
}
