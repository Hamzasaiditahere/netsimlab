"use client"

import { useState } from "react"
import type { Device, Connection } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface TopologyPanelProps {
  devices: Device[]
  connections: Connection[]
  onDeviceSelect: (device: Device) => void
}

export function TopologyPanel({ devices, connections, onDeviceSelect }: TopologyPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDevices = devices.filter(
    (device) =>
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-medium mb-2">Topología de Red</h3>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar dispositivos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Dispositivos ({filteredDevices.length})</h4>
            {filteredDevices.length === 0 ? (
              <div className="text-center text-gray-500 p-4">No se encontraron dispositivos</div>
            ) : (
              <div className="space-y-2">
                {filteredDevices.map((device) => (
                  <div
                    key={device.id}
                    className="p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                    onClick={() => onDeviceSelect(device)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{device.name}</div>
                      <div
                        className={`w-2 h-2 rounded-full ${device.status === "on" ? "bg-green-500" : "bg-gray-400"}`}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="capitalize">{device.type}</span>
                      {device.interfaces.some((i) => i.ipAddress) && (
                        <span> • {device.interfaces.find((i) => i.ipAddress)?.ipAddress}</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {device.interfaces.filter((i) => i.connectedTo).length} conexiones
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Conexiones ({connections.length})</h4>
            {connections.length === 0 ? (
              <div className="text-center text-gray-500 p-4">No hay conexiones</div>
            ) : (
              <div className="space-y-2">
                {connections.map((connection) => {
                  const sourceDevice = devices.find((d) => d.id === connection.sourceDeviceId)
                  const targetDevice = devices.find((d) => d.id === connection.targetDeviceId)

                  if (!sourceDevice || !targetDevice) return null

                  return (
                    <div key={connection.id} className="p-3 border rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          {sourceDevice.name} ↔ {targetDevice.name}
                        </div>
                        <div
                          className={`px-2 py-0.5 text-xs rounded ${
                            connection.status === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {connection.status === "up" ? "Activo" : "Inactivo"}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Cable {connection.type} • {connection.bandwidth} Mbps
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
