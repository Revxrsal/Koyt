mod listener;

use crate::ipc::listener::IpcListener;
use common::action::VideoAction;
use interprocess::local_socket::{
    GenericFilePath, GenericNamespaced, ListenerOptions, NameType, ToFsName, ToNsName,
};
use std::io;
use tokio::sync::mpsc::Receiver;

pub async fn start_ipc_server(receiver: Receiver<VideoAction>) -> anyhow::Result<()> {
    let name = "koyt.sock";
    let print_name = if GenericNamespaced::is_supported() {
        name.to_ns_name::<GenericNamespaced>()?
    } else {
        format!("/tmp/{}", name).to_fs_name::<GenericFilePath>()?
    };

    let opts = ListenerOptions::new().name(print_name);
    let listener = match opts.create_tokio() {
        Ok(listener) => IpcListener::new(listener, receiver),
        Err(e) if e.kind() == io::ErrorKind::AddrInUse => {
            // When a program that uses a file-type socket name terminates its socket server
            // without deleting the file, a "corpse socket" remains, which can neither be
            // connected to nor reused by a new listener. Normally, Interprocess takes care of
            // this on affected platforms by deleting the socket file when the listener is
            // dropped. (This is vulnerable to all sorts of races and thus can be disabled.)
            //
            // There are multiple ways this error can be handled, if it occurs, but when the
            // listener only comes from Interprocess, it can be assumed that its previous instance
            // either has crashed or simply hasn't exited yet.
            eprintln!(
                "Error: could not start server because the socket file is occupied. Please check
                if {name:?} is in use by another process and try again."
            );
            return Err(e.into());
        }
        _ => unreachable!(),
    };

    tokio::task::spawn(async move {
       listener.accept_connections().await; 
    });
    Ok(())
}
