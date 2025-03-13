use crate::extensions::win::to_string;
use crate::extensions::ExtensionExt;
use webview2_com_sys::Microsoft::Web::WebView2::Win32::{
    ICoreWebView2BrowserExtension, ICoreWebView2BrowserExtensionEnableCompletedHandler,
    ICoreWebView2BrowserExtensionEnableCompletedHandler_Impl,
    ICoreWebView2BrowserExtensionRemoveCompletedHandler,
    ICoreWebView2BrowserExtensionRemoveCompletedHandler_Impl,
};
use windows::Win32::Foundation::FALSE;
use windows_core::{implement, BOOL, HRESULT, PWSTR};

#[derive(Debug)]
pub struct BrowserExtensionHandle(pub ICoreWebView2BrowserExtension);

impl ExtensionExt for BrowserExtensionHandle {
    fn id(&self) -> String {
        self.0.id()
    }
    fn name(&self) -> String {
        self.0.name()
    }
    fn is_enabled(&self) -> bool {
        self.0.is_enabled()
    }
    fn set_enabled(&self, enabled: bool) {
        self.0.set_enabled(enabled)
    }
    fn remove(&self) {
        self.0.remove()
    }
}

impl ExtensionExt for ICoreWebView2BrowserExtension {
    fn id(&self) -> String {
        unsafe {
            let mut id: PWSTR = PWSTR::null();
            self.Id(&mut id as *mut PWSTR).unwrap();
            to_string(id)
        }
    }

    fn name(&self) -> String {
        unsafe {
            let mut name: PWSTR = PWSTR::null();
            self.Name(&mut name as *mut PWSTR).unwrap();
            to_string(name)
        }
    }

    fn is_enabled(&self) -> bool {
        unsafe {
            let mut enabled: BOOL = FALSE;
            self.IsEnabled(&mut enabled as *mut BOOL).unwrap();
            enabled.0 == 1
        }
    }

    fn set_enabled(&self, enabled: bool) {
        unsafe {
            let handler = ICoreWebView2BrowserExtensionEnableCompletedHandler::from(EnableHandler);
            self.Enable(enabled, Some(&handler)).unwrap()
        }
    }

    fn remove(&self) {
        unsafe {
            let handler = ICoreWebView2BrowserExtensionRemoveCompletedHandler::from(RemoveHandler);
            self.Remove(Some(&handler)).unwrap();
        }
    }
}

unsafe impl Send for BrowserExtensionHandle {}

unsafe impl Sync for BrowserExtensionHandle {}

#[implement(ICoreWebView2BrowserExtensionRemoveCompletedHandler)]
struct RemoveHandler;

impl ICoreWebView2BrowserExtensionRemoveCompletedHandler_Impl for RemoveHandler_Impl {
    #[allow(non_snake_case)]
    fn Invoke(&self, error_code: HRESULT) -> windows_core::Result<()> {
        error_code.ok()
    }
}

#[implement(ICoreWebView2BrowserExtensionEnableCompletedHandler)]
struct EnableHandler;

impl ICoreWebView2BrowserExtensionEnableCompletedHandler_Impl for EnableHandler_Impl {
    #[allow(non_snake_case)]
    fn Invoke(&self, error_code: HRESULT) -> windows_core::Result<()> {
        error_code.ok()
    }
}
