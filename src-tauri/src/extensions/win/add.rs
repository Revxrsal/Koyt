use std::ffi::OsStr;
use std::os::windows::ffi::OsStrExt;
use std::path::Path;
use tauri::webview::PlatformWebview;
use webview2_com_sys::Microsoft::Web::WebView2::Win32::{ICoreWebView2BrowserExtension, ICoreWebView2Profile7, ICoreWebView2ProfileAddBrowserExtensionCompletedHandler, ICoreWebView2ProfileAddBrowserExtensionCompletedHandler_Impl, ICoreWebView2_13};
use windows::core::{implement, Interface, HRESULT, PCWSTR, Result};

#[implement(ICoreWebView2ProfileAddBrowserExtensionCompletedHandler)]
pub struct AddBrowserExtensionCallback;

impl ICoreWebView2ProfileAddBrowserExtensionCompletedHandler_Impl for AddBrowserExtensionCallback_Impl {
    #[allow(non_snake_case)]
    fn Invoke(&self, error_code: HRESULT, _extension: windows_core::Ref<'_, ICoreWebView2BrowserExtension>) -> Result<()> {
        error_code.ok()
    }
}

pub fn add_extension_to_profile(profile: &ICoreWebView2Profile7, extension_folder: &OsStr) -> Result<()> {
    unsafe {
        let str: Vec<u16> = extension_folder.encode_wide()
            .chain(std::iter::once(0))
            .collect();
        let path_ptr = PCWSTR(str.as_ptr());

        let handler = AddBrowserExtensionCallback;
        let h = ICoreWebView2ProfileAddBrowserExtensionCompletedHandler::from(handler);
        profile.AddBrowserExtension(path_ptr, Some(&h))?;
    }
    Ok(())
}

pub(crate) fn add_extension(webview: &PlatformWebview, path: &Path) -> anyhow::Result<()> {
    unsafe {
        let web_view2 = webview.controller().CoreWebView2()?;
        let profile = web_view2.cast::<ICoreWebView2_13>()?.Profile()?;
        let profile: ICoreWebView2Profile7 = profile.cast()?;
        add_extension_to_profile(&profile, path.as_os_str())?;
    }
    Ok(())
}
