"use client"

import type React from "react"
import { useDrag } from "react-dnd"
import type { Device, SimulationMode } from "@/lib/types"
import { Laptop, Server, Network, Router, Trash2, Power, Camera, Smartphone, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NetworkDeviceProps {
  device: Device
  isSelected: boolean
  isConnecting: boolean
  simulationMode: SimulationMode
  viewMode: "logical" | "physical"
  onSelect: () => void
  onInterfaceClick: (deviceId: string, interfaceId: string) => void
  onDelete: () => void
  onPowerToggle: () => void
}

export function NetworkDevice({
  device,
  isSelected,
  isConnecting,
  simulationMode,
  viewMode,
  onSelect,
  onInterfaceClick,
  onDelete,
  onPowerToggle,
}: NetworkDeviceProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "NETWORK_DEVICE",
    item: { id: device.id, x: device.x, y: device.y, isNew: false },
    canDrag: simulationMode === "design",
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const getDeviceIcon = () => {
    switch (device.type) {
      case "router":
        return <Router className="w-8 h-8" />
      case "switch":
        return <Network className="w-8 h-8" />
      case "pc":
        return <Laptop className="w-8 h-8" />
      case "server":
        return <Server className="w-8 h-8" />
      case "camera":
        return <Camera className="w-8 h-8" />
      case "smartphone":
        return <Smartphone className="w-8 h-8" />
      case "access-point":
        return <Wifi className="w-8 h-8" />
      default:
        return <Laptop className="w-8 h-8" />
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect()
  }

  const handleInterfaceClick = (e: React.MouseEvent, interfaceId: string) => {
    e.stopPropagation()
    onInterfaceClick(device.id, interfaceId)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete()
  }

  const handlePowerToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    onPowerToggle()
  }

  return (
    <div
      ref={drag}
      className={`absolute flex flex-col items-center network-device ${isDragging ? "opacity-50" : ""} ${isSelected ? "z-10" : "z-0"}`}
      style={{
        left: device.x,
        top: device.y,
        cursor: simulationMode === "design" ? "move" : "pointer",
      }}
      onClick={handleClick}
    >
      {/* Device body */}
      <div
        className={`w-16 h-16 rounded-md flex items-center justify-center ${
          isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "bg-white border"
        } ${device.status === "on" ? "border-green-500" : "border-gray-300"}`}
      >
        <div className={`${device.status === "on" ? "text-gray-700" : "text-gray-400"}`}>{getDeviceIcon()}</div>

        {/* Status indicator */}
        <div
          className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
            device.status === "on" ? "bg-green-500" : "bg-gray-400"
          }`}
        />
      </div>

      {/* Device name */}
      <div className="mt-1 text-xs font-medium max-w-[80px] truncate text-center">{device.name}</div>

      {/* Interface ports */}
      <div className="mt-2 flex flex-wrap justify-center gap-1 max-w-[100px]">
        <TooltipProvider>
          {device.interfaces.map((intf) => (
            <Tooltip key={intf.id}>
              <TooltipTrigger asChild>
                <div
                  className={`w-4 h-4 rounded-full border ${
                    intf.connectedTo
                      ? intf.status === "up"
                        ? "bg-green-500 border-green-600"
                        : "bg-red-500 border-red-600"
                      : "bg-gray-200 border-gray-300"
                  } ${isConnecting || simulationMode === "design" ? "cursor-pointer hover:bg-blue-300" : ""}`}
                  onClick={(e) => handleInterfaceClick(e, intf.id)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  <div>{intf.name}</div>
                  {intf.ipAddress && <div>IP: {intf.ipAddress}</div>}
                  <div>
                    Estado: {intf.connectedTo ? (intf.status === "up" ? "Activo" : "Inactivo") : "No conectado"}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {/* Control buttons - only visible when selected */}
      {isSelected && (
        <div className="absolute -top-3 -right-3 flex space-x-1">
          {/* Power button */}
          <Button
            variant={device.status === "on" ? "default" : "outline"}
            size="icon"
            className="w-6 h-6"
            onClick={handlePowerToggle}
          >
            <Power className="w-3 h-3" />
          </Button>

          {/* Delete button - only in design mode */}
          {simulationMode === "design" && (
            <Button variant="destructive" size="icon" className="w-6 h-6" onClick={handleDelete}>
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
