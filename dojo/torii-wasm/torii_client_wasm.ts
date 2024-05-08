import * as WebAssembly from 'react-native-webassembly'
import torriiWasm from './torii_client_wasm_bg.wasm'
import { createClient as createClientWasm } from './torii_client_wasm_bg.js'

export const createClient = async (initialModelsToSync: any[], config: any) => {
  const module = await WebAssembly.instantiate(torriiWasm as any)
  return createClientWasm(initialModelsToSync, config, module)
}
