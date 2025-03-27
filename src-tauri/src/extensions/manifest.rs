use serde::{Deserialize, Serialize};
use specta::Type;
use std::fs::File;
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
pub struct ExtensionManifest {
    manifest_version: u32,
    id: Option<String>,
    name: String,
    version: String,
    description: String,
}

impl ExtensionManifest {
    pub fn manifest_version(&self) -> u32 {
        self.manifest_version
    }

    pub fn name(&self) -> &str {
        &self.name
    }

    pub fn version(&self) -> &str {
        &self.version
    }

    pub fn description(&self) -> &str {
        &self.description
    }

    pub fn id(&self) -> &str {
        match &self.id {
            Some(id) => id,
            None => "",
        }
    }
}

pub fn parse_manifest(id: &str, path: &PathBuf) -> anyhow::Result<ExtensionManifest> {
    if !path.exists() {
        return Err(anyhow::format_err!("manifest.json does not exist!"));
    }
    let file = File::open(path)?;

    let mut manifest: ExtensionManifest = serde_json::from_reader(file)?;
    manifest.id = Some(id.to_string());
    Ok(manifest)
}
