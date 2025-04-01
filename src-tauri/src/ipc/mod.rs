use common::hotkey::HotKey;

pub async fn dispatch_hotkey(hotkey: &HotKey) {
    println!("dispatch_hotkey {:?}", hotkey);
}
