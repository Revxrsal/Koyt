use interprocess::local_socket::{
    GenericFilePath, GenericNamespaced, Name, NameType, ToFsName, ToNsName,
};

pub fn ipc_address<'s>() -> anyhow::Result<Name<'s>> {
    let name = "kbyoutube.sock";
    let print_name = if GenericNamespaced::is_supported() {
        name.to_ns_name::<GenericNamespaced>()?
    } else {
        format!("/tmp/{}", name).to_fs_name::<GenericFilePath>()?
    };
    Ok(print_name)
}

pub fn ipc_fs_path() -> String {
    String::from("/tmp/kbyoutube.sock")
}
