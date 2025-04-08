"use client"

import { useState, useRef, useEffect } from "react"
import { NetworkCanvas } from "@/components/network-canvas"
import { DevicePanel } from "@/components/device-panel"
import { ConfigPanel } from "@/components/config-panel"
import { SimulationControls } from "@/components/simulation-controls"
import { PacketInspector } from "@/components/packet-inspector"
import { ConsolePanel } from "@/components/console-panel"
import { TopologyPanel } from "@/components/topology-panel"
import { DocumentationPanel } from "@/components/documentation-panel"
import { SettingsPanel } from "@/components/settings-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Network, LayoutGrid, Terminal, Box, Layers, Settings, HelpCircle, Save, FolderOpen } from "lucide-react"
import type { DeviceType, Device, Connection, SimulationMode, CableType, Packet, LogEntry } from "@/lib/types"
import { generateDeviceConfig } from "@/lib/device-config"
import { useToast } from "@/hooks/use-toast"
import { SettingsProvider, useSettings } from "@/lib/settings-context"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

function NetSimLab() {
  const [devices, setDevices] = useState<Device[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [simulationMode, setSimulationMode] = useState<SimulationMode>("design")
  const [isSimulating, setIsSimulating] = useState(false)
  const [viewMode, setViewMode] = useState<"logical" | "physical">("logical")
  const [packets, setPackets] = useState<Packet[]>([])
  const [selectedPacket, setSelectedPacket] = useState<Packet | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [connectingCable, setConnectingCable] = useState<{
    type: CableType
    sourceId: string
    sourceInterface: string
  } | null>(null)
  const [showConsole, setShowConsole] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showDocumentation, setShowDocumentation] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const nextId = useRef(1)
  const { toast } = useToast()
  const { language, simulationSpeed, showPacketAnimation, darkMode } = useSettings()

  // Show documentation on first load
  useEffect(() => {
    const hasSeenDocumentation = localStorage.getItem("netsimlab-documentation-seen")
    if (!hasSeenDocumentation) {
      // Small delay to ensure DOM is fully rendered
      setTimeout(() => {
        setShowDocumentation(true)
        localStorage.setItem("netsimlab-documentation-seen", "true")
      }, 500)
    }
  }, [])

  // Add initial log entry
  useEffect(() => {
    addLog(
      "system",
      language === "es" ? "Bienvenido a NetSimLab - Simulador de Redes" : "Welcome to NetSimLab - Network Simulator",
    )
  }, [language])

  const addLog = (type: "system" | "error" | "info" | "command", message: string) => {
    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      type,
      message,
    }
    setLogs((prev) => [...prev, newLog])
  }

  const handleAddDevice = (type: DeviceType, x: number, y: number) => {
    const deviceId = `device-${nextId.current++}`
    const config = generateDeviceConfig(type, deviceId, nextId.current - 1)

    const newDevice: Device = {
      id: deviceId,
      type,
      x,
      y,
      name: config.name,
      interfaces: config.interfaces,
      config: config.config,
      status: "off",
    }

    setDevices((prev) => [...prev, newDevice])
    addLog("info", language === "es" ? `Dispositivo ${newDevice.name} añadido` : `Device ${newDevice.name} added`)

    // Auto-select the new device
    setSelectedDevice(newDevice)
  }

  const handleDeviceSelect = (device: Device | null) => {
    setSelectedDevice(device)
    if (device) {
      addLog("info", language === "es" ? `Dispositivo ${device.name} seleccionado` : `Device ${device.name} selected`)
    }
  }

  const handleDeviceMove = (id: string, x: number, y: number) => {
    setDevices((prev) => prev.map((device) => (device.id === id ? { ...device, x, y } : device)))
  }

  const handleDeviceUpdate = (updatedDevice: Device) => {
    setDevices((prev) => prev.map((device) => (device.id === updatedDevice.id ? updatedDevice : device)))
    addLog(
      "info",
      language === "es"
        ? `Configuración de ${updatedDevice.name} actualizada`
        : `Configuration of ${updatedDevice.name} updated`,
    )

    toast({
      title: language === "es" ? "Configuración guardada" : "Configuration saved",
      description:
        language === "es"
          ? `Los cambios en ${updatedDevice.name} han sido aplicados.`
          : `Changes to ${updatedDevice.name} have been applied.`,
    })
  }

  const handleDevicePowerToggle = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((device) => {
        if (device.id === deviceId) {
          const newStatus = device.status === "on" ? "off" : "on"
          addLog(
            "info",
            language === "es"
              ? `Dispositivo ${device.name} ${newStatus === "on" ? "encendido" : "apagado"}`
              : `Device ${device.name} ${newStatus === "on" ? "powered on" : "powered off"}`,
          )
          return { ...device, status: newStatus }
        }
        return device
      }),
    )
  }

  // Modificar la función handleSelectCableType para mejorar la selección de cables
  const handleSelectCableType = (type: CableType) => {
    // Si ya hay un cable seleccionado del mismo tipo, lo deseleccionamos
    if (connectingCable?.type === type) {
      setConnectingCable(null)
      addLog("info", language === "es" ? `Cable ${type} deseleccionado` : `${type} cable deselected`)
    } else {
      // Si no hay cable seleccionado o es de otro tipo, seleccionamos el nuevo
      setConnectingCable({
        type,
        sourceId: "",
        sourceInterface: "",
      })
      addLog(
        "info",
        language === "es" ? `Cable ${type} seleccionado para conexión` : `${type} cable selected for connection`,
      )
    }
  }

  // Modificar la función handleStartConnection para arreglar la conexión de cables
  const handleStartConnection = (deviceId: string, interfaceId: string) => {
    if (!connectingCable) {
      // Si no hay un cable seleccionado, verificamos si hay un tipo de cable seleccionado
      const selectedCableType = document.querySelector('[data-state="active"][value="cables"]')

      if (!selectedCableType) {
        toast({
          title: language === "es" ? "Seleccione un tipo de cable" : "Select a cable type",
          description:
            language === "es"
              ? "Debe seleccionar un tipo de cable antes de conectar dispositivos."
              : "You must select a cable type before connecting devices.",
          variant: "destructive",
        })
        return
      }

      // Buscar el primer cable disponible si no hay uno específicamente seleccionado
      const cableType: CableType = "ethernet" // Por defecto usamos ethernet

      setConnectingCable({
        type: cableType,
        sourceId: deviceId,
        sourceInterface: interfaceId,
      })
    } else {
      // Si ya hay un cable en proceso de conexión, completamos la conexión
      handleCompleteConnection(deviceId, interfaceId)
    }

    const device = devices.find((d) => d.id === deviceId)
    if (device) {
      addLog(
        "info",
        language === "es" ? `Iniciando conexión desde ${device.name}` : `Starting connection from ${device.name}`,
      )
    }
  }

  const handleCompleteConnection = (targetId: string, targetInterface: string) => {
    if (!connectingCable) return

    const { sourceId, sourceInterface, type } = connectingCable

    // Check if connection already exists
    const connectionExists = connections.some(
      (c) =>
        (c.sourceDeviceId === sourceId && c.targetDeviceId === targetId) ||
        (c.sourceDeviceId === targetId && c.targetDeviceId === sourceId),
    )

    if (connectionExists) {
      toast({
        title: language === "es" ? "Conexión existente" : "Existing connection",
        description:
          language === "es"
            ? "Ya existe una conexión entre estos dispositivos."
            : "A connection already exists between these devices.",
        variant: "destructive",
      })
      setConnectingCable(null)
      return
    }

    // Check if interfaces are compatible with the cable type
    const sourceDevice = devices.find((d) => d.id === sourceId)
    const targetDevice = devices.find((d) => d.id === targetId)

    if (!sourceDevice || !targetDevice) {
      setConnectingCable(null)
      return
    }

    const sourceIntf = sourceDevice.interfaces.find((i) => i.id === sourceInterface)
    const targetIntf = targetDevice.interfaces.find((i) => i.id === targetInterface)

    if (!sourceIntf || !targetIntf) {
      setConnectingCable(null)
      return
    }

    // Check compatibility (simplified)
    let isCompatible = true
    let compatibilityIssue = ""

    // Example compatibility check
    if (type === "fiber" && (!sourceIntf.supportsFiber || !targetIntf.supportsFiber)) {
      isCompatible = false
      compatibilityIssue =
        language === "es"
          ? "Las interfaces seleccionadas no soportan conexiones de fibra."
          : "The selected interfaces do not support fiber connections."
    }

    if (type === "serial" && (!sourceIntf.supportsSerial || !targetIntf.supportsSerial)) {
      isCompatible = false
      compatibilityIssue =
        language === "es"
          ? "Las interfaces seleccionadas no soportan conexiones seriales."
          : "The selected interfaces do not support serial connections."
    }

    if (!isCompatible) {
      toast({
        title: language === "es" ? "Interfaces incompatibles" : "Incompatible interfaces",
        description: compatibilityIssue,
        variant: "destructive",
      })
      setConnectingCable(null)
      return
    }

    // Create the connection
    const newConnection: Connection = {
      id: `conn-${nextId.current++}`,
      sourceDeviceId: sourceId,
      sourceInterfaceId: sourceInterface,
      targetDeviceId: targetId,
      targetInterfaceId: targetInterface,
      type,
      status: "down",
      bandwidth: type === "fiber" ? 1000 : type === "ethernet" ? 100 : 10, // Mbps
      latency: type === "fiber" ? 1 : type === "ethernet" ? 5 : 10, // ms
    }

    setConnections((prev) => [...prev, newConnection])

    // Update device interfaces to reflect connection
    setDevices((prev) =>
      prev.map((device) => {
        if (device.id === sourceId) {
          return {
            ...device,
            interfaces: device.interfaces.map((intf) =>
              intf.id === sourceInterface
                ? {
                    ...intf,
                    connectedTo: targetId,
                    connectedToInterface: targetInterface,
                    connectionId: newConnection.id,
                  }
                : intf,
            ),
          }
        }
        if (device.id === targetId) {
          return {
            ...device,
            interfaces: device.interfaces.map((intf) =>
              intf.id === targetInterface
                ? {
                    ...intf,
                    connectedTo: sourceId,
                    connectedToInterface: sourceInterface,
                    connectionId: newConnection.id,
                  }
                : intf,
            ),
          }
        }
        return device
      }),
    )

    addLog(
      "info",
      language === "es"
        ? `Conexión establecida entre ${sourceDevice.name} y ${targetDevice.name} usando cable ${type}`
        : `Connection established between ${sourceDevice.name} and ${targetDevice.name} using ${type} cable`,
    )
    setConnectingCable(null)
  }

  const handleCancelConnection = () => {
    setConnectingCable(null)
    addLog("info", language === "es" ? "Conexión cancelada" : "Connection canceled")
  }

  const handleDeleteConnection = (connectionId: string) => {
    const connection = connections.find((c) => c.id === connectionId)
    if (!connection) return

    setConnections((prev) => prev.filter((c) => c.id !== connectionId))

    // Update device interfaces to reflect disconnection
    setDevices((prev) =>
      prev.map((device) => {
        if (device.id === connection.sourceDeviceId || device.id === connection.targetDeviceId) {
          return {
            ...device,
            interfaces: device.interfaces.map((intf) => {
              if (
                (device.id === connection.sourceDeviceId && intf.id === connection.sourceInterfaceId) ||
                (device.id === connection.targetDeviceId && intf.id === connection.targetInterfaceId)
              ) {
                return {
                  ...intf,
                  connectedTo: null,
                  connectedToInterface: null,
                  connectionId: null,
                }
              }
              return intf
            }),
          }
        }
        return device
      }),
    )

    addLog("info", language === "es" ? "Conexión eliminada" : "Connection deleted")
  }

  const handleDeleteDevice = (deviceId: string) => {
    const deviceToDelete = devices.find((d) => d.id === deviceId)
    if (!deviceToDelete) return

    // First, delete all connections to this device
    const connectionsToDelete = connections.filter(
      (c) => c.sourceDeviceId === deviceId || c.targetDeviceId === deviceId,
    )

    connectionsToDelete.forEach((conn) => {
      handleDeleteConnection(conn.id)
    })

    // Then delete the device
    setDevices((prev) => prev.filter((d) => d.id !== deviceId))

    // Clear selection if the deleted device was selected
    if (selectedDevice?.id === deviceId) {
      setSelectedDevice(null)
    }

    addLog(
      "info",
      language === "es" ? `Dispositivo ${deviceToDelete.name} eliminado` : `Device ${deviceToDelete.name} deleted`,
    )
  }

  const handleStartSimulation = () => {
    // Check if there are devices to simulate
    if (devices.length === 0) {
      toast({
        title: language === "es" ? "No hay dispositivos" : "No devices",
        description:
          language === "es"
            ? "Añada al menos un dispositivo para iniciar la simulación."
            : "Add at least one device to start the simulation.",
        variant: "destructive",
      })
      return
    }

    // Check if all devices are configured properly
    const unconfiguredDevices = devices.filter((device) => {
      // Example check: routers and PCs should have IP addresses
      if (device.type === "router" || device.type === "pc") {
        return device.interfaces.some((intf) => !intf.ipAddress && intf.connectedTo)
      }
      return false
    })

    if (unconfiguredDevices.length > 0) {
      toast({
        title: language === "es" ? "Dispositivos sin configurar" : "Unconfigured devices",
        description:
          language === "es"
            ? `${unconfiguredDevices.length} dispositivos no tienen configuración completa.`
            : `${unconfiguredDevices.length} devices do not have complete configuration.`,
        variant: "destructive",
      })
      // Continue anyway
    }

    setSimulationMode("simulation")
    setIsSimulating(true)
    addLog("system", language === "es" ? "Simulación iniciada" : "Simulation started")

    // Turn on all devices
    setDevices((prev) =>
      prev.map((device) => ({
        ...device,
        status: "on",
      })),
    )

    // Set all connections to up state
    setConnections((prev) =>
      prev.map((conn) => ({
        ...conn,
        status: "up",
      })),
    )
  }

  const handleStopSimulation = () => {
    setIsSimulating(false)
    addLog("system", language === "es" ? "Simulación pausada" : "Simulation paused")
  }

  const handleResetSimulation = () => {
    setSimulationMode("design")
    setIsSimulating(false)
    setPackets([])
    setSelectedPacket(null)
    addLog(
      "system",
      language === "es"
        ? "Simulación detenida, volviendo al modo de diseño"
        : "Simulation stopped, returning to design mode",
    )
  }

  const handleSaveTopology = () => {
    try {
      const topology = {
        devices,
        connections,
      }

      const dataStr = JSON.stringify(topology)
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

      const exportFileDefaultName = "netsimlab-topology.json"

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()

      addLog("info", language === "es" ? "Topología guardada correctamente" : "Topology saved successfully")
      toast({
        title: language === "es" ? "Topología guardada" : "Topology saved",
        description:
          language === "es"
            ? "La topología de red ha sido guardada correctamente."
            : "The network topology has been saved successfully.",
      })
    } catch (error) {
      addLog("error", language === "es" ? "Error al guardar la topología" : "Error saving topology")
      toast({
        title: language === "es" ? "Error al guardar" : "Error saving",
        description:
          language === "es" ? "No se pudo guardar la topología de red." : "Could not save the network topology.",
        variant: "destructive",
      })
    }
  }

  const handleLoadTopology = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"

    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const topology = JSON.parse(event.target?.result as string)

          if (topology.devices && topology.connections) {
            setDevices(topology.devices)
            setConnections(topology.connections)
            addLog("info", language === "es" ? "Topología cargada correctamente" : "Topology loaded successfully")
            toast({
              title: language === "es" ? "Topología cargada" : "Topology loaded",
              description:
                language === "es"
                  ? "La topología de red ha sido cargada correctamente."
                  : "The network topology has been loaded successfully.",
            })
          } else {
            throw new Error("Formato de archivo inválido")
          }
        } catch (error) {
          addLog("error", language === "es" ? "Error al cargar la topología" : "Error loading topology")
          toast({
            title: language === "es" ? "Error al cargar" : "Error loading",
            description:
              language === "es"
                ? "El archivo seleccionado no es una topología válida."
                : "The selected file is not a valid topology.",
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    }

    input.click()
  }

  const handleSendPing = (sourceId: string, destinationIp: string) => {
    if (!isSimulating) {
      toast({
        title: language === "es" ? "Simulación no activa" : "Simulation not active",
        description:
          language === "es" ? "Inicie la simulación para enviar pings." : "Start the simulation to send pings.",
        variant: "destructive",
      })
      return
    }

    const sourceDevice = devices.find((d) => d.id === sourceId)
    if (!sourceDevice) return

    // Find destination device by IP
    const destinationDevice = devices.find((d) => d.interfaces.some((intf) => intf.ipAddress === destinationIp))

    if (!destinationDevice) {
      addLog(
        "error",
        language === "es"
          ? `Ping desde ${sourceDevice.name}: No se pudo encontrar el host ${destinationIp}`
          : `Ping from ${sourceDevice.name}: Could not find host ${destinationIp}`,
      )
      return
    }

    // Create a ping packet
    const newPacket: Packet = {
      id: `packet-${Date.now()}`,
      type: "icmp",
      subtype: "echo-request",
      sourceDeviceId: sourceId,
      sourceIp: sourceDevice.interfaces.find((i) => i.ipAddress)?.ipAddress || "0.0.0.0",
      destinationDeviceId: destinationDevice.id,
      destinationIp: destinationIp,
      size: 64,
      ttl: 64,
      content: "PING Request",
      timestamp: new Date(),
      path: [sourceId],
      status: "in-transit",
    }

    setPackets((prev) => [...prev, newPacket])
    addLog(
      "info",
      language === "es"
        ? `Ping enviado desde ${sourceDevice.name} a ${destinationIp}`
        : `Ping sent from ${sourceDevice.name} to ${destinationIp}`,
    )

    // Simulate ping response after a delay
    setTimeout(() => {
      const responsePacket: Packet = {
        id: `packet-${Date.now()}`,
        type: "icmp",
        subtype: "echo-reply",
        sourceDeviceId: destinationDevice.id,
        sourceIp: destinationIp,
        destinationDeviceId: sourceId,
        destinationIp: sourceDevice.interfaces.find((i) => i.ipAddress)?.ipAddress || "0.0.0.0",
        size: 64,
        ttl: 64,
        content: "PING Reply",
        timestamp: new Date(),
        path: [destinationDevice.id],
        status: "delivered",
      }

      setPackets((prev) => [...prev, responsePacket])
      addLog(
        "info",
        language === "es"
          ? `Respuesta de ping recibida de ${destinationIp}`
          : `Ping response received from ${destinationIp}`,
      )
    }, 1000 / simulationSpeed)
  }

  const handleToggleConsole = () => {
    setShowConsole((prev) => !prev)
  }

  const handleExecuteCommand = (deviceId: string, command: string) => {
    if (!deviceId) {
      addLog(
        "error",
        language === "es" ? "Seleccione un dispositivo para ejecutar comandos" : "Select a device to execute commands",
      )
      return
    }

    const device = devices.find((d) => d.id === deviceId)
    if (!device) return

    addLog("command", `[${device.name}]# ${command}`)

    // Process command (simplified)
    const commandLower = command.toLowerCase().trim()

    if (commandLower === "show interfaces" || commandLower === "ifconfig") {
      device.interfaces.forEach((intf) => {
        addLog(
          "info",
          language === "es"
            ? `[${device.name}] ${intf.name}: ${intf.ipAddress || "sin IP"} ${intf.connectedTo ? "CONECTADO" : "DESCONECTADO"}`
            : `[${device.name}] ${intf.name}: ${intf.ipAddress || "no IP"} ${intf.connectedTo ? "CONNECTED" : "DISCONNECTED"}`,
        )
      })
    } else if (commandLower === "show ip route" || commandLower === "route") {
      if (device.type === "router") {
        const routes = device.config.routes || []
        if (routes.length === 0) {
          addLog(
            "info",
            language === "es" ? `[${device.name}] No hay rutas configuradas` : `[${device.name}] No routes configured`,
          )
        } else {
          routes.forEach((route) => {
            addLog(
              "info",
              language === "es"
                ? `[${device.name}] ${route.network}/${route.netmask} via ${route.gateway || "directamente conectado"} dev ${route.interface}`
                : `[${device.name}] ${route.network}/${route.netmask} via ${route.gateway || "directly connected"} dev ${route.interface}`,
            )
          })
        }
      } else {
        addLog(
          "info",
          language === "es"
            ? `[${device.name}] Comando no soportado en este tipo de dispositivo`
            : `[${device.name}] Command not supported on this device type`,
        )
      }
    } else if (commandLower.startsWith("ping ")) {
      const ipToPing = command.split(" ")[1]
      if (ipToPing) {
        handleSendPing(deviceId, ipToPing)
      } else {
        addLog(
          "error",
          language === "es" ? `[${device.name}] Uso: ping <dirección-ip>` : `[${device.name}] Usage: ping <ip-address>`,
        )
      }
    } else {
      addLog(
        "info",
        language === "es"
          ? `[${device.name}] Comando no reconocido: ${command}`
          : `[${device.name}] Command not recognized: ${command}`,
      )
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`flex flex-col h-screen ${darkMode ? "dark" : ""}`}>
        <div className={`flex flex-col h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100"}`}>
          <header
            className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b p-2 flex items-center justify-between`}
          >
            <div className="flex items-center">
              <Network className={`w-6 h-6 mr-2 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
              <h1 className="text-xl font-bold">NetSimLab</h1>

              <Separator orientation="vertical" className="h-6 mx-4" />

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="gap-1" onClick={handleSaveTopology}>
                  <Save className="w-4 h-4" />
                  {language === "es" ? "Guardar" : "Save"}
                </Button>
                <Button variant="outline" size="sm" className="gap-1" onClick={handleLoadTopology}>
                  <FolderOpen className="w-4 h-4" />
                  {language === "es" ? "Cargar" : "Load"}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "logical" | "physical")}>
                <TabsList className="h-8">
                  <TabsTrigger value="logical" className="text-xs px-3 py-1">
                    <LayoutGrid className="w-4 h-4 mr-1" />
                    {language === "es" ? "Lógico" : "Logical"}
                  </TabsTrigger>
                  <TabsTrigger value="physical" className="text-xs px-3 py-1">
                    <Box className="w-4 h-4 mr-1" />
                    {language === "es" ? "Físico" : "Physical"}
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="simulation-controls">
                <SimulationControls
                  mode={simulationMode}
                  isSimulating={isSimulating}
                  onStartSimulation={handleStartSimulation}
                  onStopSimulation={handleStopSimulation}
                  onResetSimulation={handleResetSimulation}
                />
              </div>

              <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} className="settings-button">
                <Settings className="w-5 h-5" />
              </Button>

              <Button variant="ghost" size="icon" onClick={() => setShowDocumentation(true)}>
                <HelpCircle className="w-5 h-5" />
              </Button>
            </div>
          </header>

          {/* Add specific class names to the main sections for easier targeting */}
          <div className="flex flex-1 overflow-hidden">
            <div className="device-panel w-64 bg-white border-r flex flex-col overflow-hidden">
              <DevicePanel
                onAddDevice={handleAddDevice}
                onSelectCableType={handleSelectCableType}
                selectedCableType={connectingCable?.type}
              />
            </div>

            <div className="flex-1 relative flex flex-col network-canvas">
              <NetworkCanvas
                devices={devices}
                connections={connections}
                selectedDevice={selectedDevice}
                simulationMode={simulationMode}
                viewMode={viewMode}
                isSimulating={isSimulating}
                connectingCable={connectingCable}
                packets={packets}
                onDeviceSelect={handleDeviceSelect}
                onDeviceMove={handleDeviceMove}
                onDevicePowerToggle={handleDevicePowerToggle}
                onStartConnection={handleStartConnection}
                onCompleteConnection={handleCompleteConnection}
                onCancelConnection={handleCancelConnection}
                onDeleteConnection={handleDeleteConnection}
                onDeleteDevice={handleDeleteDevice}
                onPacketSelect={setSelectedPacket}
                setViewMode={setViewMode}
              />

              {showConsole && (
                <div
                  className={`h-1/3 border-t ${
                    darkMode ? "bg-gray-900 border-gray-700" : "bg-black"
                  } text-white overflow-hidden`}
                >
                  <ConsolePanel
                    selectedDevice={selectedDevice}
                    logs={logs}
                    onExecuteCommand={handleExecuteCommand}
                    onClose={handleToggleConsole}
                  />
                </div>
              )}
            </div>

            <div
              className={`config-panel w-80 ${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
              } border-l flex flex-col overflow-hidden`}
            >
              <Tabs defaultValue="config" className="flex-1 flex flex-col">
                <TabsList
                  className={`px-4 pt-2 justify-start ${darkMode ? "border-gray-700" : "border-gray-200"} border-b rounded-none gap-2`}
                >
                  <TabsTrigger
                    value="config"
                    className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    {language === "es" ? "Configuración" : "Configuration"}
                  </TabsTrigger>
                  <TabsTrigger
                    value="topology"
                    className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700"
                  >
                    <Layers className="w-4 h-4 mr-1" />
                    {language === "es" ? "Topología" : "Topology"}
                  </TabsTrigger>
                  <TabsTrigger
                    value="packets"
                    className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700"
                  >
                    <Box className="w-4 h-4 mr-1" />
                    {language === "es" ? "Paquetes" : "Packets"}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="config" className="flex-1 p-0 m-0 overflow-auto">
                  {selectedDevice ? (
                    <ConfigPanel
                      device={selectedDevice}
                      onUpdateDevice={handleDeviceUpdate}
                      simulationMode={simulationMode}
                    />
                  ) : (
                    <div className={`p-4 text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {language === "es"
                        ? "Seleccione un dispositivo para configurarlo"
                        : "Select a device to configure it"}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="topology" className="flex-1 p-0 m-0 overflow-auto">
                  <TopologyPanel devices={devices} connections={connections} onDeviceSelect={handleDeviceSelect} />
                </TabsContent>

                <TabsContent value="packets" className="flex-1 p-0 m-0 overflow-auto">
                  <PacketInspector
                    packets={packets}
                    selectedPacket={selectedPacket}
                    onPacketSelect={setSelectedPacket}
                  />
                </TabsContent>
              </Tabs>

              <div className={`${darkMode ? "border-gray-700" : "border-gray-200"} border-t p-2 flex justify-between`}>
                <Button variant="outline" size="sm" className="gap-1 console-toggle" onClick={handleToggleConsole}>
                  <Terminal className="w-4 h-4" />
                  {showConsole
                    ? language === "es"
                      ? "Ocultar Consola"
                      : "Hide Console"
                    : language === "es"
                      ? "Mostrar Consola"
                      : "Show Console"}
                </Button>

                <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} flex items-center`}>
                  {devices.length} {language === "es" ? "dispositivos" : "devices"},{connections.length}{" "}
                  {language === "es" ? "conexiones" : "connections"}
                </div>
              </div>
            </div>
          </div>

          {showHelp && (
            <div
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowHelp(false)}
            >
              <div
                className={`${darkMode ? "bg-gray-800 text-white" : "bg-white"} rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-auto`}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-bold mb-4">
                  {language === "es" ? "Ayuda de NetSimLab" : "NetSimLab Help"}
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">{language === "es" ? "Diseño de Red" : "Network Design"}</h3>
                    <ul className="list-disc pl-5 text-sm">
                      <li>
                        {language === "es"
                          ? "Arrastre dispositivos desde el panel izquierdo al lienzo"
                          : "Drag devices from the left panel to the canvas"}
                      </li>
                      <li>
                        {language === "es"
                          ? "Seleccione un tipo de cable y haga clic en los puertos de los dispositivos para conectarlos"
                          : "Select a cable type and click on device ports to connect them"}
                      </li>
                      <li>
                        {language === "es"
                          ? "Haga clic en un dispositivo para configurarlo en el panel derecho"
                          : "Click on a device to configure it in the right panel"}
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold">{language === "es" ? "Simulación" : "Simulation"}</h3>
                    <ul className="list-disc pl-5 text-sm">
                      <li>
                        {language === "es"
                          ? 'Haga clic en "Iniciar Simulación" para probar su red'
                          : 'Click on "Start Simulation" to test your network'}
                      </li>
                      <li>
                        {language === "es"
                          ? 'Use la consola para ejecutar comandos como "ping" o "show interfaces"'
                          : 'Use the console to run commands like "ping" or "show interfaces"'}
                      </li>
                      <li>
                        {language === "es"
                          ? "Observe el tráfico de paquetes en tiempo real"
                          : "Watch packet traffic in real-time"}
                      </li>
                      <li>
                        {language === "es"
                          ? 'Inspeccione los paquetes en la pestaña "Paquetes"'
                          : 'Inspect packets in the "Packets" tab'}
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold">{language === "es" ? "Comandos Útiles" : "Useful Commands"}</h3>
                    <ul className="list-disc pl-5 text-sm">
                      <li>
                        <code>show interfaces</code> -
                        {language === "es" ? "Muestra las interfaces del dispositivo" : "Shows device interfaces"}
                      </li>
                      <li>
                        <code>show ip route</code> -
                        {language === "es"
                          ? "Muestra la tabla de enrutamiento (routers)"
                          : "Shows routing table (routers)"}
                      </li>
                      <li>
                        <code>ping &lt;ip&gt;</code> -
                        {language === "es"
                          ? "Envía un ping a la dirección IP especificada"
                          : "Sends a ping to the specified IP address"}
                      </li>
                    </ul>
                  </div>
                </div>

                <Button className="mt-4 w-full" onClick={() => setShowHelp(false)}>
                  {language === "es" ? "Cerrar" : "Close"}
                </Button>
              </div>
            </div>
          )}

          {showDocumentation && <DocumentationPanel onClose={() => setShowDocumentation(false)} />}
          {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
        </div>
      </div>
    </DndProvider>
  )
}

export default function NetSimLabWrapper() {
  return (
    <SettingsProvider>
      <NetSimLab />
    </SettingsProvider>
  )
}
