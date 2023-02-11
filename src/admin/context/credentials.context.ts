import { createContext } from "solid-js";
import { ICredential } from "../../contracts/credential";
import { anyObject } from "../../helper/typescriptHacks";

export const CredentialsContext = createContext<ICredential>(anyObject);