use interprocess::local_socket::{
    GenericFilePath, GenericNamespaced, Name, NameType, ToFsName, ToNsName,
};

pub fn ipc_address<'s>() -> anyhow::Result<Name<'s>> {
    let name = "koyt.sock";
    let print_name = if GenericNamespaced::is_supported() {
        name.to_ns_name::<GenericNamespaced>()?
    } else {
        format!("/tmp/{}", name).to_fs_name::<GenericFilePath>()?
    };
    Ok(print_name)
}
