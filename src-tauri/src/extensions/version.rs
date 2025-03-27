use serde::{Deserialize, Serialize};
use specta::Type;
use std::fmt::{Display, Formatter};

#[derive(Serialize, Deserialize, Type, Clone, Debug)]
pub struct ChromeVersion {
    major: u16,
    minor: u16,
    build: u16,
    patch: u16,
}

impl ChromeVersion {
    pub fn new(major: u16, minor: u16, build: u16, patch: u16) -> Self {
        Self {
            major,
            minor,
            build,
            patch,
        }
    }

    pub fn major(&self) -> u16 {
        self.major
    }

    pub fn minor(&self) -> u16 {
        self.minor
    }

    pub fn build(&self) -> u16 {
        self.build
    }

    pub fn patch(&self) -> u16 {
        self.patch
    }
}

impl Display for ChromeVersion {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{}.{}.{}.{}",
            self.major(),
            self.minor(),
            self.build(),
            self.patch()
        )
    }
}

#[derive(Serialize, Deserialize, Type, Clone, Debug)]
pub enum Arch {
    ARM,
    X86_32,
    X86_64,
}

impl Arch {
    pub fn name(&self) -> &'static str {
        match self {
            Arch::ARM => "arm",
            Arch::X86_32 => "x86-32",
            Arch::X86_64 => "x86_64",
        }
    }
}

impl Display for Arch {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.name())
    }
}
