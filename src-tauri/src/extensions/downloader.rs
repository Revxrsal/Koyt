use crate::extensions::manifest::{parse_manifest, ExtensionManifest};
use crate::extensions::version::{Arch, ChromeVersion};
use regex_macro::regex;
use std::fs::create_dir_all;
use std::io::Cursor;
use std::path::PathBuf;

async fn download_and_extract(url: String, path: &PathBuf) {
    let resp = reqwest::get(&url).await.unwrap();
    if resp.status().is_success() {
        let content = resp.bytes().await.unwrap();
        create_dir_all(&path).unwrap();
        zip_extract::extract(Cursor::new(&content), &path, true).unwrap();
    } else {
        resp.error_for_status().unwrap();
    }
}

pub async fn download_extension(
    url: String,
    version: &ChromeVersion,
    arch: &Arch,
    download_in: PathBuf,
) -> Option<ExtensionManifest> {
    let chrome_url_pattern =
        regex!(r"^https?:\/\/chrome\.google\.com\/webstore\/.+?\/([a-z]{32})([\/#?]|$)");
    let chrome_new_url_pattern =
        regex!(r"^https?:\/\/chromewebstore\.google\.com\/detail\/.+?\/([a-z]{32})([\/#?]|$)");
    let mut result = chrome_url_pattern.captures(&url);
    if result.is_none() {
        result = chrome_new_url_pattern.captures(&url);
    }
    if let Some(result) = result {
        if let Some(extension_id) = result.get(1) {
            let extension_id = extension_id.as_str();
            let url = format!("https://clients2.google.com/service/update2/crx?response=redirect&prodversion={version}&x=id%3D{extension_id}%26installsource%3Dondemand%26uc&nacl_arch={arch}&acceptformat=crx2,crx3");
            let folder = download_in.join(&extension_id);
            download_and_extract(url, &folder).await;
            let manifest = parse_manifest(extension_id, &folder.join("manifest.json")).unwrap();
            return Some(manifest);
        }
    }
    None
}
