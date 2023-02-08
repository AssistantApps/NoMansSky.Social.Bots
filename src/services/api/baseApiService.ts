import axios from 'axios';
import { createWriteStream } from 'fs';

import { ResultWithValue } from '../../contracts/resultWithValue';
import { anyObject } from '../../helper/typescriptHacks';

export class BaseApiService {
  private _baseUrl?: String;
  constructor(newBaseUrl?: String) {
    if (newBaseUrl != null) this._baseUrl = newBaseUrl;
  }
  protected async get<T>(url: string): Promise<ResultWithValue<T>> {
    try {
      const result = await axios.get<T>(`${this._baseUrl}/${url}`);
      return {
        isSuccess: true,
        value: result.data,
        errorMessage: ''
      }
    } catch (ex) {
      return {
        isSuccess: false,
        value: anyObject,
        errorMessage: (ex as any).message
      }
    }
  }

  protected async post<T, TK>(url: string, data: TK, customMapper?: (data: any) => any): Promise<ResultWithValue<T>> {
    try {
      const result = await axios.post<T>(`${this._baseUrl}/${url}`, data);
      if (customMapper != null) return customMapper(result);
      return {
        isSuccess: true,
        value: result.data,
        errorMessage: ''
      }
    } catch (ex) {
      return {
        isSuccess: false,
        value: anyObject,
        errorMessage: (ex as any).message
      }
    }
  }

  async getRemoteImageAsBase64(url: string): Promise<string> {
    const arrayBuffer = await axios.get(url, {
      responseType: 'arraybuffer'
    });
    let buffer = Buffer.from(arrayBuffer.data, 'binary').toString("base64");
    let image = `data:${arrayBuffer.headers["content-type"]};base64,${buffer}`;
    return image;
  }
}
