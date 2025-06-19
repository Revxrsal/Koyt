use aes_gcm::aead::Aead;
use aes_gcm::{Aes256Gcm, Key};
use aes_gcm::{KeyInit, Nonce};
use once_cell::sync::{Lazy};
use rand::rngs::OsRng;
use rand::TryRngCore;
use sha2::{Digest, Sha256};

#[derive(Debug)]
pub struct Encryptor {
    secret: Key<Aes256Gcm>,
}

static ENCRYPTOR: Lazy<Encryptor> = Lazy::new(|| Encryptor::new());

pub fn encryptor() -> &'static Encryptor {
    &ENCRYPTOR
}

impl Encryptor {
    pub fn new() -> Self {
        Self {
            secret: derive_key_from_secret("U4lZPV8EyT9j2p+GqQK3PpUCrcMp4QqXL2kCH7aYvX4="),
        }
    }

    pub fn secret(&self) -> &Key<Aes256Gcm> {
        &self.secret
    }

    pub fn encrypt(&self, content: &[u8]) -> anyhow::Result<Vec<u8>> {
        let cipher = Aes256Gcm::new(self.secret());
        let mut nonce_bytes = [0u8; 12];
        let mut rng = OsRng::default();
        rng.try_fill_bytes(&mut nonce_bytes)?;
        let nonce = Nonce::from(nonce_bytes); // 96-bits

        let cipher_text = cipher.encrypt(&nonce, content)?;

        // Store nonce + ciphertext together
        let mut encrypted_data = nonce_bytes.to_vec();
        encrypted_data.extend_from_slice(&cipher_text);
        Ok(encrypted_data)
    }

    pub fn decrypt(&self, encrypt_content: &[u8]) -> anyhow::Result<Vec<u8>> {
        let cipher = Aes256Gcm::new(self.secret());
        let (nonce_bytes, cipher_text) = encrypt_content.split_at(12);
        let nonce = Nonce::try_from(nonce_bytes)?;

        let content = cipher.decrypt(&nonce, cipher_text)?;
        Ok(content)
    }
}

fn derive_key_from_secret(secret: &str) -> Key<Aes256Gcm> {
    let hash = Sha256::digest(secret);
    hash.try_into().unwrap()
}
