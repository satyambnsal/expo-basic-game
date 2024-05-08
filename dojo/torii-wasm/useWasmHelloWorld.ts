import { useWasmUri } from './useWasmUri'

export const useWasmHelloWorld = () => {
  const wasm = useWasmUri<{
    readonly add: (a: number, b: number) => number
  }>(
    'https://github.com/torch2424/wasm-by-example/raw/master/examples/hello-world/demo/assemblyscript/hello-world.wasm'
  )

  const result = 'result' in wasm ? wasm.result : undefined
  const error = 'error' in wasm ? wasm.error : undefined

  return { result, error }
}
