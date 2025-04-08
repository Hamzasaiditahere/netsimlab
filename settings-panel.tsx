"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { X, Languages, Settings, Save } from "lucide-react"
import { useSettings } from "@/lib/settings-context"

interface SettingsPanelProps {
  onClose: () => void
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const {
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
  } = useSettings()

  const [localSettings, setLocalSettings] = useState({
    language,
    simulationSpeed,
    showPacketAnimation,
    autoArrangeDevices,
    darkMode,
  })

  const handleSave = () => {
    setLanguage(localSettings.language)
    setSimulationSpeed(localSettings.simulationSpeed)
    setShowPacketAnimation(localSettings.showPacketAnimation)
    setAutoArrangeDevices(localSettings.autoArrangeDevices)
    setDarkMode(localSettings.darkMode)
    onClose()
  }

  const translations = {
    title: {
      es: "Ajustes",
      en: "Settings",
    },
    language: {
      es: "Idioma",
      en: "Language",
    },
    spanish: {
      es: "Español",
      en: "Spanish",
    },
    english: {
      es: "Inglés",
      en: "English",
    },
    simulation: {
      es: "Simulación",
      en: "Simulation",
    },
    simulationSpeed: {
      es: "Velocidad de Simulación",
      en: "Simulation Speed",
    },
    slow: {
      es: "Lenta",
      en: "Slow",
    },
    fast: {
      es: "Rápida",
      en: "Fast",
    },
    showPacketAnimation: {
      es: "Mostrar Animación de Paquetes",
      en: "Show Packet Animation",
    },
    interface: {
      es: "Interfaz",
      en: "Interface",
    },
    autoArrangeDevices: {
      es: "Organizar Dispositivos Automáticamente",
      en: "Auto-arrange Devices",
    },
    darkMode: {
      es: "Modo Oscuro",
      en: "Dark Mode",
    },
    save: {
      es: "Guardar Cambios",
      en: "Save Changes",
    },
    cancel: {
      es: "Cancelar",
      en: "Cancel",
    },
  }

  const t = (key: keyof typeof translations) => {
    return translations[key][localSettings.language as "es" | "en"]
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-[500px] max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-xl font-bold">{t("title")}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Language Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <Languages className="w-5 h-5 mr-2 text-blue-600" />
              {t("language")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-3 border rounded-md cursor-pointer flex items-center ${
                  localSettings.language === "es" ? "border-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => setLocalSettings({ ...localSettings, language: "es" })}
              >
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3 text-lg">🇪🇸</div>
                <div>
                  <div className="font-medium">{t("spanish")}</div>
                  <div className="text-xs text-gray-500">Español</div>
                </div>
              </div>
              <div
                className={`p-3 border rounded-md cursor-pointer flex items-center ${
                  localSettings.language === "en" ? "border-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => setLocalSettings({ ...localSettings, language: "en" })}
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-lg">🇬🇧</div>
                <div>
                  <div className="font-medium">{t("english")}</div>
                  <div className="text-xs text-gray-500">English</div>
                </div>
              </div>
            </div>
          </div>

          {/* Simulation Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t("simulation")}</h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>{t("simulationSpeed")}</Label>
                <span className="text-sm text-gray-500">{localSettings.simulationSpeed}x</span>
              </div>
              <Slider
                value={[localSettings.simulationSpeed]}
                min={0.5}
                max={3}
                step={0.5}
                onValueChange={(value) => setLocalSettings({ ...localSettings, simulationSpeed: value[0] })}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{t("slow")}</span>
                <span>{t("fast")}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-animation">{t("showPacketAnimation")}</Label>
              <Switch
                id="show-animation"
                checked={localSettings.showPacketAnimation}
                onCheckedChange={(checked) => setLocalSettings({ ...localSettings, showPacketAnimation: checked })}
              />
            </div>
          </div>

          {/* Interface Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t("interface")}</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-arrange">{t("autoArrangeDevices")}</Label>
              <Switch
                id="auto-arrange"
                checked={localSettings.autoArrangeDevices}
                onCheckedChange={(checked) => setLocalSettings({ ...localSettings, autoArrangeDevices: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">{t("darkMode")}</Label>
              <Switch
                id="dark-mode"
                checked={localSettings.darkMode}
                onCheckedChange={(checked) => setLocalSettings({ ...localSettings, darkMode: checked })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            {t("save")}
          </Button>
        </div>
      </div>
    </div>
  )
}
