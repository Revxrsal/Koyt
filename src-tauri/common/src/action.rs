use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
pub enum BoolAction {
    Enable,
    Disable,
    Toggle,
}

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
pub enum VideoAction {
    Nothing,
    Playing(BoolAction),
    Fullscreen(BoolAction),
    Subtitles(BoolAction),
    PiP(BoolAction),
    Loop(BoolAction),
    ChangeSpeed(f32),
    SetSpeed(f32),
    ChangeVolume(f32),
    SetVolume(f32),
    Forward(f32),
    Rewind(f32),
    TakeScreenshot,
}
