use crate::extensions::ExtensionExt;
use tauri::webview::PlatformWebview;
use webview2_com_sys::Microsoft::Web::WebView2::Win32::{ICoreWebView2BrowserExtensionList, ICoreWebView2Profile7, ICoreWebView2ProfileGetBrowserExtensionsCompletedHandler, ICoreWebView2ProfileGetBrowserExtensionsCompletedHandler_Impl, ICoreWebView2_13};
use windows::core::{implement, Interface, Result, HRESULT};

pub fn remove_extension(
    webview: &PlatformWebview,
    extension_name: &str,
) -> anyhow::Result<()> {
    unsafe {
        let web_view2 = webview.controller().CoreWebView2()?;
        let profile = Interface::cast::<ICoreWebView2_13>(&web_view2)?.Profile()?;
        let profile: ICoreWebView2Profile7 = profile.cast()?;
        let handler = RemoveExtensionCallback::new(extension_name.into());
        let handler = ICoreWebView2ProfileGetBrowserExtensionsCompletedHandler::from(handler);
        profile.GetBrowserExtensions(Some(&handler))?;
    }
    Ok(())
}

#[implement(ICoreWebView2ProfileGetBrowserExtensionsCompletedHandler)]
struct RemoveExtensionCallback {
    extension_name: String,
}

impl RemoveExtensionCallback {
    pub fn new(extension_name: String) -> Self {
        Self { extension_name }
    }
}

impl ICoreWebView2ProfileGetBrowserExtensionsCompletedHandler_Impl for RemoveExtensionCallback_Impl {
    #[allow(non_snake_case)]
    fn Invoke(&self, error_code: HRESULT, extensions: windows_core::Ref<'_, ICoreWebView2BrowserExtensionList>) -> Result<()> {
        if error_code.is_err() {
            return error_code.ok();
        }
        if extensions.is_none() {
            return Ok(());
        }
        unsafe {
            let extensions = extensions.unwrap();
            let mut count: u32 = 0;
            extensions.Count(&mut count as *mut u32)?;
            for i in 0..count {
                let extension = extensions.GetValueAtIndex(i);
                if let Ok(extension) = extension {
                    if extension.name().eq_ignore_ascii_case(&self.extension_name) {
                        extension.remove();
                        return Ok(());
                    }
                }
            }
            println!("No such extension: {}", self.extension_name);
        }
        Ok(())
    }
}
