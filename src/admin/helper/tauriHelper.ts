import { invoke } from "@tauri-apps/api/tauri";

export const callTauri = async (funcName: string, args: any): Promise<unknown> => await invoke(funcName, { ...args });
