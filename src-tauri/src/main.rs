#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn get_enc_key() -> String {
    "dfe017aaf71d43239a3f661ad9b3a2b8".to_string()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_enc_key])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
