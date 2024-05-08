import * as React from 'react'
import * as WebAssembly from 'react-native-webassembly'

import { useWasmUri } from './useWasmUri'

type Circom = {}

export function useToriiWasm() {
  const wasm = useWasmUri<Circom>(
    'https://github.com/cawfree/zk-assets/raw/main/Circuits/01/.wasm',
    React.useMemo(
      () => ({
        env: {
          memory: new WebAssembly.Memory({ initial: 32767 }),
        },
        runtime: {
          exceptionHandler(value: number) {
            console.warn('got exception', value)
          },
        },
      }),
      []
    )
  )

  const result = 'result' in wasm ? wasm.result : undefined
  const error = 'error' in wasm ? wasm.error : undefined

  return { result, error }
}
