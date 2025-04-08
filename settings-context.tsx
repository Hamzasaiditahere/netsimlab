"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface SettingsContextType {
  language: string
  setLanguage: (language: string) => void
  simulationSpeed: number
  setSimulationSpeed: (speed: number) => void
  showPacketAnimation: boolean
  setShowPacketAnimation: (show: boolean) => void
  autoArrangeDevices: boolean
  setAutoArrangeDevices: (auto: boolean) => void
  darkMode: boolean
  setDarkMode: (dark: boolean) => void
}

const SettingsContext = createContext<SettingsContextType>({
  language: "es",
  setLanguage: () => {},
  simulationSpeed: 1,
  setSimulationSpeed: () => {},
  showPacketAnimation: true,
  setShowPacketAnimation: () => {},
  autoArrangeDevices: false,
  setAutoArrangeDevices: () => {},
  darkMode: false,
  setDarkMode: () => {},
})

export const useSettings = () => useContext(SettingsContext)

interface SettingsProviderProps {
  children: ReactNode
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  // Try to load settings from localStorage, or use defaults
  const [language, setLanguage] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("netsimlab-language") || "es"
    }
    return "es"
  })

  const [simulationSpeed, setSimulationSpeed] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return Number.parseFloat(localStorage.getItem("netsimlab-simulation-speed") || "1")
    }
    return 1
  })

  const [showPacketAnimation, setShowPacketAnimation] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("netsimlab-show-packet-animation") !== "false"
    }
    return true
  })

  const [autoArrangeDevices, setAutoArrangeDevices] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("netsimlab-auto-arrange") === "true"
    }
    return false
  })

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("netsimlab-dark-mode") === "true"
    }
    return false
  })

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("netsimlab-language", language)
  }, [language])

  useEffect(() => {
    localStorage.setItem("netsimlab-simulation-speed", simulationSpeed.toString())
  }, [simulationSpeed])

  useEffect(() => {
    localStorage.setItem("netsimlab-show-packet-animation", showPacketAnimation.toString())
  }, [showPacketAnimation])

  useEffect(() => {
    localStorage.setItem("netsimlab-auto-arrange", autoArrangeDevices.toString())
  }, [autoArrangeDevices])

  useEffect(() => {
    localStorage.setItem("netsimlab-dark-mode", darkMode.toString())

    // Apply dark mode to the document
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  return (
    <SettingsContext.Provider
      value={{
        language,
        setLanguage,
        simulationSpeed,
        setSimulationSpeed,
        showPacketAnimation,
        setShowPacketAnimation,
        autoArrangeDevices,
        setAutoArrangeDevices,
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
