import * as React from 'react'
import * as WebAssembly from 'react-native-webassembly'

import { useWasmUri } from './useWasmUri'

type Circom = {
  readonly getVersion: () => number
  readonly getFieldNumLen32: () => number
  readonly getRawPrime: () => number
  readonly getWitnessSize: () => number
  readonly init: (shouldSanityCheck: number) => undefined
  readonly getInputSignalSize: (a: number, b: number) => number
  readonly readSharedRWMemory: (a: number) => number
  readonly writeSharedRWMemory: (a: number, b: number) => undefined
  readonly setInputSignal: (a: number, b: number, c: number) => undefined
  readonly getWitness: (a: number) => undefined
}

export function useToriiWasm() {
  const wasm = useWasmUri<Circom>(
    'https://github.com/cawfree/zk-assets/raw/main/Circuits/01/.wasm',
    React.useMemo(
      () => ({
        env: {
          // https://github.com/iden3/circom_runtime/blob/f9de6f7d6efe521b5df6775258779ec9032b5830/js/witness_calculator.js#L27
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

  const calculateWTNSBin = React.useCallback(
    (input: Circuits_01_Input, sanityCheck: number = 0) => {
      if (!result) throw new Error('Not ready to calculate.')

      const circom: Circom = result.instance.exports

      const n32 = circom.getFieldNumLen32()
      const witnessSize = circom.getWitnessSize()

      circom.getRawPrime()

      const arr = new Uint32Array(n32)

      for (let i = 0; i < n32; i += 1) {
        arr[n32 - 1 - i] = circom.readSharedRWMemory(i)
      }

      const prime = fromArray32(arr)

      calculateWTNSBinInternal({ circom, input, sanityCheck, prime })

      const len = witnessSize * n32 + n32 + 11

      const buff32 = new Uint32Array(len)
      const buff = new Uint8Array(buff32.buffer)

      //"wtns"
      buff[0] = 'w'.charCodeAt(0)
      buff[1] = 't'.charCodeAt(0)
      buff[2] = 'n'.charCodeAt(0)
      buff[3] = 's'.charCodeAt(0)

      //version 2
      buff32[1] = 2

      //number of sections: 2
      buff32[2] = 2

      //id section 1
      buff32[3] = 1

      const n8 = n32 * 4

      //id section 1 length in 64bytes
      const idSection1length = 8 + n8
      const idSection1lengthHex = idSection1length.toString(16)

      buff32[4] = parseInt(idSection1lengthHex.slice(0, 8), 16)
      buff32[5] = parseInt(idSection1lengthHex.slice(8, 16), 16)

      //this.n32
      buff32[6] = n8

      circom.getRawPrime()

      var pos = 7

      for (let j = 0; j < n32; j += 1) {
        buff32[pos + j] = circom.readSharedRWMemory(j)
      }

      pos += n32

      // witness size
      buff32[pos] = witnessSize
      pos++

      //id section 2
      buff32[pos] = 2
      pos++

      // section 2 length
      const idSection2length = n8 * witnessSize
      const idSection2lengthHex = idSection2length.toString(16)
      buff32[pos] = parseInt(idSection2lengthHex.slice(0, 8), 16)
      buff32[pos + 1] = parseInt(idSection2lengthHex.slice(8, 16), 16)

      pos += 2
      for (let i = 0; i < witnessSize; i += 1) {
        circom.getWitness(i)
        for (let j = 0; j < n32; j += 1) {
          buff32[pos + j] = circom.readSharedRWMemory(j)
        }
        pos += n32
      }

      return buff
    },
    [result]
  )

  return { calculateWTNSBin, error }
}
