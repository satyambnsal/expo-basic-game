import manifest from './generated/manifests/manifest.json'
import { createDojoConfig } from '@dojoengine/core'

export const dojoConfig = createDojoConfig({
  manifest,
})
