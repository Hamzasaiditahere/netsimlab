"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useDrop } from "react-dnd"
import type { Device, Connection, SimulationMode, CableType, Packet } from "@/lib/types"
import { NetworkDevice } from "@/components/network-device"
import { ConnectionLine } from "@/components/connection-line"
import { ZapOff, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/lib/settings-context"

interface NetworkCanvasProps {
  devices: Device[]
  connections: Connection[]
  selectedDevice: Device | null
  simulationMode: SimulationMode
  viewMode: "logical" | "physical"
  isSimulating: boolean
  connectingCable: {
    type: CableType
    sourceId: string
    sourceInterface: string
  } | null
  packets: Packet[]
  onDeviceSelect: (device: Device | null) => void
  onDeviceMove: (id: string, x: number, y: number) => void
  onDevicePowerToggle: (id: string) => void
  onStartConnection: (deviceId: string, interfaceId: string) => void
  onCompleteConnection: (deviceId: string, interfaceId: string) => void
  onCancelConnection: () => void
  onDeleteConnection: (connectionId: string) => void
  onDeleteDevice: (deviceId: string) => void
  onPacketSelect: (packet: Packet | null) => void
  setViewMode: (mode: "logical" | "physical") => void
}

export function NetworkCanvas({
  devices,
  connections,
  selectedDevice,
  simulationMode,
  viewMode,
  isSimulating,
  connectingCable,
  packets,
  onDeviceSelect,
  onDeviceMove,
  onDevicePowerToggle,
  onStartConnection,
  onCompleteConnection,
  onCancelConnection,
  onDeleteConnection,
  onDeleteDevice,
  onPacketSelect,
  setViewMode,
}: NetworkCanvasProps) {
  const [temporaryLine, setTemporaryLine] = useState<{
    x1: number
    y1: number
    x2: number
    y2: number
  } | null>(null)
  const [visiblePackets, setVisiblePackets] = useState<Packet[]>([])
  const canvasRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const { language, showPacketAnimation, darkMode } = useSettings()

  const [, drop] = useDrop({
    accept: "NETWORK_DEVICE",
    drop: (item: any, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset()
      const left = Math.round(item.x + (delta?.x || 0))
      const top = Math.round(item.y + (delta?.y || 0))

      if (item.isNew) {
        // This is a new device being added from the panel
        const canvasRect = canvasRef.current?.getBoundingClientRect()
        if (canvasRect) {
          const dropPoint = monitor.getClientOffset()
          if (dropPoint) {
            const x = (dropPoint.x - canvasRect.left - offset.x) / scale
            const y = (dropPoint.y - canvasRect.top - offset.y) / scale
            // Call the parent's onAddDevice with the correct position
            // This is handled by the DevicePanel component
          }
        }
      } else {
        // This is an existing device being moved
        onDeviceMove(item.id, left, top)
      }
      return undefined
    },
  })

  // Handle mouse move for temporary connection line
  useEffect(() => {
    if (!connectingCable) {
      setTemporaryLine(null)
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current || !connectingCable) return

      const canvasRect = canvasRef.current.getBoundingClientRect()
      const sourceDevice = devices.find((d) => d.id === connectingCable.sourceId)

      if (!sourceDevice) return

      // Calculate source position (center of the device)
      const x1 = sourceDevice.x + 25
      const y1 = sourceDevice.y + 25

      // Calculate mouse position relative to canvas
      const x2 = (e.clientX - canvasRect.left - offset.x) / scale
      const y2 = (e.clientY - canvasRect.top - offset.y) / scale

      setTemporaryLine({ x1, y1, x2, y2 })
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [connectingCable, devices, offset, scale])

  // Handle canvas zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      setScale((prev) => Math.min(Math.max(0.5, prev + delta), 2))
    }
  }

  // Handle canvas drag
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag canvas if not clicking on a device
    if ((e.target as HTMLElement).closest(".network-device")) return

    setIsDraggingCanvas(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingCanvas) return

    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y

    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDraggingCanvas(false)
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Ignore if clicking on a device
    if ((e.target as HTMLElement).closest(".network-device")) return

    // Deselect when clicking on empty canvas
    onDeviceSelect(null)

    // Cancel connection if in progress
    if (connectingCable) {
      onCancelConnection()
    }
  }

  const handleInterfaceClick = (deviceId: string, interfaceId: string) => {
    if (simulationMode !== "design") return

    if (!connectingCable) {
      // Iniciar conexión
      onStartConnection(deviceId, interfaceId)
    } else if (connectingCable.sourceId !== deviceId) {
      // Completar conexión si no es el mismo dispositivo
      onCompleteConnection(deviceId, interfaceId)
    } else if (connectingCable.sourceInterface !== interfaceId) {
      // Si es el mismo dispositivo pero diferente interfaz, permitir la conexión
      onCompleteConnection(deviceId, interfaceId)
    } else {
      // Cancelar si es la misma interfaz
      onCancelConnection()
    }
  }

  // Update visible packets based on simulation state
  useEffect(() => {
    if (!isSimulating || !showPacketAnimation) {
      setVisiblePackets([])
      return
    }

    setVisiblePackets(packets.filter((p) => p.status === "in-transit"))
  }, [isSimulating, packets, showPacketAnimation])

  // Reset view
  const handleResetView = () => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={(node) => {
          drop(node)
          if (node) canvasRef.current = node
        }}
        className={`w-full h-full ${darkMode ? "bg-gray-800" : "bg-white"} relative overflow-hidden`}
        onClick={handleCanvasClick}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid background */}
        <div
          className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"
          style={{
            transform: `scale(${scale}) translate(${offset.x / scale}px, ${offset.y / scale}px)`,
            transformOrigin: "0 0",
          }}
        />

        {/* Transformation container */}
        <div
          className="absolute inset-0"
          style={{
            transform: `scale(${scale}) translate(${offset.x / scale}px, ${offset.y / scale}px)`,
            transformOrigin: "0 0",
          }}
        >
          {/* Connections */}
          {connections.map((connection) => {
            const sourceDevice = devices.find((d) => d.id === connection.sourceDeviceId)
            const targetDevice = devices.find((d) => d.id === connection.targetDeviceId)

            if (!sourceDevice || !targetDevice) return null

            return (
              <ConnectionLine
                key={connection.id}
                connection={connection}
                sourceX={sourceDevice.x}
                sourceY={sourceDevice.y}
                targetX={targetDevice.x}
                targetY={targetDevice.y}
                isSelected={selectedDevice?.id === sourceDevice.id || selectedDevice?.id === targetDevice.id}
                simulationMode={simulationMode}
                onDelete={() => onDeleteConnection(connection.id)}
              />
            )
          })}

          {/* Temporary connection line when connecting */}
          {temporaryLine && (
            <div
              className={`absolute border-2 border-dashed ${
                connectingCable?.type === "ethernet"
                  ? "border-blue-500"
                  : connectingCable?.type === "crossover"
                    ? "border-orange-500"
                    : connectingCable?.type === "serial"
                      ? "border-green-500"
                      : connectingCable?.type === "fiber"
                        ? "border-purple-500"
                        : connectingCable?.type === "console"
                          ? "border-gray-500"
                          : "border-blue-500"
              }`}
              style={{
                position: "absolute",
                left: temporaryLine.x1,
                top: temporaryLine.y1,
                width: Math.sqrt(
                  Math.pow(temporaryLine.x2 - temporaryLine.x1, 2) + Math.pow(temporaryLine.y2 - temporaryLine.y1, 2),
                ),
                height: 0,
                transformOrigin: "0 0",
                transform: `rotate(${Math.atan2(
                  temporaryLine.y2 - temporaryLine.y1,
                  temporaryLine.x2 - temporaryLine.x1,
                )}rad)`,
                zIndex: 10,
                pointerEvents: "none",
              }}
            />
          )}

          {/* Devices */}
          {devices.map((device) => (
            <NetworkDevice
              key={device.id}
              device={device}
              isSelected={selectedDevice?.id === device.id}
              isConnecting={connectingCable !== null}
              simulationMode={simulationMode}
              viewMode={viewMode}
              onSelect={() => onDeviceSelect(device)}
              onInterfaceClick={handleInterfaceClick}
              onDelete={() => onDeleteDevice(device.id)}
              onPowerToggle={() => onDevicePowerToggle(device.id)}
            />
          ))}

          {/* Simulation packets */}
          {showPacketAnimation &&
            visiblePackets.map((packet) => {
              const sourceDevice = devices.find((d) => d.id === packet.sourceDeviceId)
              const destDevice = devices.find((d) => d.id === packet.destinationDeviceId)

              if (!sourceDevice || !destDevice) return null

              // Calculate packet position (simplified)
              const progress = Math.random() // In a real app, this would be based on time and path
              const x = sourceDevice.x + (destDevice.x - sourceDevice.x) * progress + 25
              const y = sourceDevice.y + (destDevice.y - sourceDevice.y) * progress + 25

              return (
                <div
                  key={packet.id}
                  className={`absolute w-3 h-3 rounded-full cursor-pointer ${
                    packet.type === "icmp"
                      ? "bg-green-500"
                      : packet.type === "tcp"
                        ? "bg-blue-500"
                        : packet.type === "udp"
                          ? "bg-purple-500"
                          : "bg-gray-500"
                  }`}
                  style={{
                    left: x,
                    top: y,
                    transform: "translate(-50%, -50%)",
                    boxShadow: `0 0 8px ${
                      packet.type === "icmp"
                        ? "#10b981"
                        : packet.type === "tcp"
                          ? "#3b82f6"
                          : packet.type === "udp"
                            ? "#8b5cf6"
                            : "#6b7280"
                    }`,
                    zIndex: 20,
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onPacketSelect(packet)
                  }}
                />
              )
            })}
        </div>

        {/* Connection instructions */}
        {connectingCable && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-md z-30">
            {language === "es"
              ? "Haga clic en la interfaz de otro dispositivo para conectar, o en cualquier lugar para cancelar"
              : "Click on another device's interface to connect, or anywhere to cancel"}
          </div>
        )}

        {/* Simulation mode indicator */}
        {simulationMode === "simulation" && (
          <div className="absolute top-4 left-4 bg-green-100 border border-green-500 text-green-700 px-3 py-1 rounded-md flex items-center z-30">
            {isSimulating ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                {language === "es" ? "Simulación en curso" : "Simulation running"}
              </>
            ) : (
              <>
                <ZapOff className="w-4 h-4 mr-2" />
                {language === "es" ? "Simulación pausada" : "Simulation paused"}
              </>
            )}
          </div>
        )}

        {/* View controls */}
        <div className="absolute bottom-4 right-4 flex flex-col space-y-2 z-30">
          <Button variant="outline" size="icon" onClick={() => setScale((prev) => Math.min(prev + 0.1, 2))}>
            +
          </Button>
          <Button variant="outline" size="icon" onClick={() => setScale((prev) => Math.max(prev - 0.1, 0.5))}>
            -
          </Button>
          <Button variant="outline" size="icon" onClick={handleResetView}>
            ↺
          </Button>
        </div>

        {/* Warning for physical view mode */}
        {viewMode === "physical" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-40">
            <div className="text-center p-6 max-w-md">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">
                {language === "es" ? "Vista Física en Desarrollo" : "Physical View in Development"}
              </h3>
              <p className="text-gray-600">
                {language === "es"
                  ? "La vista física que muestra el montaje 3D de los equipos está en desarrollo. Por favor, utilice la vista lógica por ahora."
                  : "The physical view showing 3D equipment mounting is under development. Please use the logical view for now."}
              </p>
              <Button className="mt-4" onClick={() => setViewMode("logical")}>
                {language === "es" ? "Volver a Vista Lógica" : "Return to Logical View"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
