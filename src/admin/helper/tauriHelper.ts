import { resolveResource } from '@tauri-apps/api/path'
import { readTextFile } from '@tauri-apps/api/fs'
import { invoke } from "@tauri-apps/api/tauri";

export const callTauri = async (funcName: string, args: any): Promise<any> => await invoke(funcName, { ...args });

export const loadTauriResource = async (fullFilePath: string): Promise<string> => {
    const resourcePath = await resolveResource(fullFilePath);
    const content = await readTextFile(resourcePath);
    return content;
}

export const isRunningInTauri = (): boolean => {
    const windowAsAny = window as any;
    return (windowAsAny.__TAURI__ || windowAsAny.__TAURI_METADATA__);
}