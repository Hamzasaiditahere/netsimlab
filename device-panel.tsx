"use client"

import type React from "react"
import { useDrag } from "react-dnd"
import type { DeviceType, CableType } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Laptop, Server, Network, Router, Camera, Smartphone, Wifi, Cable } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DevicePanelProps {
  onAddDevice: (type: DeviceType, x: number, y: number) => void
  onSelectCableType: (type: CableType) => void
  selectedCableType: CableType | undefined
}

export function DevicePanel({ onAddDevice, onSelectCableType, selectedCableType }: DevicePanelProps) {
  return (
    <div className="device-panel-content w-full h-full">
      <Tabs defaultValue="devices" className="flex-1 flex flex-col h-full">
        <TabsList className="px-4 pt-2 justify-start border-b rounded-none gap-2">
          <TabsTrigger value="devices" className="data-[state=active]:bg-gray-100">
            Dispositivos
          </TabsTrigger>
          <TabsTrigger value="cables" className="data-[state=active]:bg-gray-100">
            Cables
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <TabsContent value="devices" className="p-4 space-y-4 m-0">
              <div className="font-semibold text-sm">Dispositivos de Red</div>

              <DeviceItem
                type="router"
                name="Router"
                icon={<Router className="w-5 h-5" />}
                description="Enrutamiento, NAT, ACLs"
                onAddDevice={onAddDevice}
              />

              <DeviceItem
                type="switch"
                name="Switch"
                icon={<Network className="w-5 h-5" />}
                description="VLANs, STP, trunking"
                onAddDevice={onAddDevice}
              />

              <div className="font-semibold text-sm mt-6">Equipos Finales</div>

              <DeviceItem
                type="pc"
                name="PC"
                icon={<Laptop className="w-5 h-5" />}
                description="Pruebas de red, navegación"
                onAddDevice={onAddDevice}
              />

              <DeviceItem
                type="server"
                name="Servidor"
                icon={<Server className="w-5 h-5" />}
                description="DHCP, DNS, HTTP, FTP"
                onAddDevice={onAddDevice}
              />

              <div className="font-semibold text-sm mt-6">Dispositivos IoT</div>

              <DeviceItem
                type="camera"
                name="Cámara IP"
                icon={<Camera className="w-5 h-5" />}
                description="Videovigilancia"
                onAddDevice={onAddDevice}
              />

              <DeviceItem
                type="smartphone"
                name="Smartphone"
                icon={<Smartphone className="w-5 h-5" />}
                description="Cliente móvil"
                onAddDevice={onAddDevice}
              />

              <DeviceItem
                type="access-point"
                name="Punto de Acceso"
                icon={<Wifi className="w-5 h-5" />}
                description="Conexión inalámbrica"
                onAddDevice={onAddDevice}
              />
            </TabsContent>

            <TabsContent value="cables" className="p-4 space-y-4 m-0">
              <div className="text-sm text-gray-500 mb-4">
                Seleccione un tipo de cable y luego haga clic en las interfaces de los dispositivos para conectarlos.
              </div>

              <CableItem
                type="ethernet"
                name="Cable Ethernet"
                color="bg-blue-500"
                description="PC a switch, router a switch"
                isSelected={selectedCableType === "ethernet"}
                onSelect={onSelectCableType}
              />

              <CableItem
                type="crossover"
                name="Cable Cruzado"
                color="bg-orange-500"
                description="Switch a switch, router a router"
                isSelected={selectedCableType === "crossover"}
                onSelect={onSelectCableType}
              />

              <CableItem
                type="serial"
                name="Cable Serial"
                color="bg-green-500"
                description="Router a router (WAN)"
                isSelected={selectedCableType === "serial"}
                onSelect={onSelectCableType}
              />

              <CableItem
                type="fiber"
                name="Cable de Fibra"
                color="bg-purple-500"
                description="Conexiones de alta velocidad"
                isSelected={selectedCableType === "fiber"}
                onSelect={onSelectCableType}
              />

              <CableItem
                type="console"
                name="Cable de Consola"
                color="bg-gray-500"
                description="Configuración de dispositivos"
                isSelected={selectedCableType === "console"}
                onSelect={onSelectCableType}
              />
            </TabsContent>
          </ScrollArea>
        </div>
      </Tabs>

      <div className="p-3 border-t">
        <div className="text-xs text-gray-500">
          Arrastre dispositivos al lienzo y conéctelos con cables para diseñar su red.
        </div>
      </div>
    </div>
  )
}

interface DeviceItemProps {
  type: DeviceType
  name: string
  icon: React.ReactNode
  description: string
  onAddDevice: (type: DeviceType, x: number, y: number) => void
}

function DeviceItem({ type, name, icon, description, onAddDevice }: DeviceItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "NETWORK_DEVICE",
    item: { type, isNew: true },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<{ x: number; y: number }>()
      if (item && dropResult) {
        // Default position if dropped
        onAddDevice(type, 100, 100)
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      className={`flex items-center p-3 border rounded-md cursor-grab ${isDragging ? "opacity-50" : ""} hover:bg-gray-50`}
      onClick={() => onAddDevice(type, 100, 100)}
    >
      <div className="mr-3 text-gray-600">{icon}</div>
      <div>
        <div className="font-medium text-sm">{name}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
    </div>
  )
}

interface CableItemProps {
  type: CableType
  name: string
  color: string
  description: string
  isSelected: boolean
  onSelect: (type: CableType) => void
}

function CableItem({ type, name, color, description, isSelected, onSelect }: CableItemProps) {
  return (
    <div
      className={`flex items-center p-3 border rounded-md cursor-pointer ${
        isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
      }`}
      onClick={() => onSelect(type)}
    >
      <div className="mr-3 flex items-center">
        <Cable className="w-5 h-5 text-gray-600" />
        <div className={`w-4 h-1 ${color} ml-1`}></div>
      </div>
      <div>
        <div className="font-medium text-sm">{name}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
    </div>
  )
}
