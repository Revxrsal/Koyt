import {Arch, ChromeVersion} from "~/gen/bindings";

export function getNaclArch(): Arch {
  let nacl_arch: Arch = 'ARM';
  if (navigator.userAgent.indexOf('x86') > 0) {
    nacl_arch = 'X86_32';
  } else if (navigator.userAgent.indexOf('x64') > 0) {
    nacl_arch = 'X86_64';
  }
  return nacl_arch;
}

export function getChromeVersion(): ChromeVersion {
  let parts = navigator.userAgent.match(/Chrom(?:e|ium)\/([0-9]+)\.([0-9]+)\.([0-9]+)\.([0-9]+)/);
  if (parts == null || parts.length != 5) {
    return {major: 129, minor: 0, patch: 0, build: 0};
  }
  const pieces = parts.map(piece => parseInt(piece, 10));
  return {
    major: pieces[1],
    minor: pieces[2],
    build: pieces[3],
    patch: pieces[4]
  };
}
