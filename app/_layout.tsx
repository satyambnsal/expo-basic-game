import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'

import { useColorScheme } from '@/hooks/useColorScheme'
import { DojoContext } from '@/dojo/DojoContext'
import { SetupResult, setup } from '@/dojo/generated/setup'
import { dojoConfig } from '@/dojo/dojoConfig'
import { useWasmHelloWorld } from '@/dojo/torii-wasm/useWasmHelloWorld'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })
  const [setupResult, setSetupResult] = useState<SetupResult>({} as SetupResult)

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  useEffect(() => {
    setup(dojoConfig).then((result) => {
      setSetupResult(result)
    })
  }, [])

  if (!loaded) {
    return null
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <DojoContext.Provider value={setupResult}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </DojoContext.Provider>
    </ThemeProvider>
  )
}
