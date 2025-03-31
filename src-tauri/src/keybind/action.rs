use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
pub enum VideoAction {
    Play,
    Pause,
    Toggle,
    ChangeSpeed { modifier: f32 },
    SetSpeed { to: f32 },
    ChangeVolume { modifier: f32 },
    SetVolume { to: f32 },
    Forward { by: f32 },
    Rewind { by: f32 },
    ToggleFullscreen,
    ToggleSubtitles,
    NextChapter,
    PreviousChapter,
    TakeScreenshot,
    TogglePiP,
    ToggleLoop,
}
