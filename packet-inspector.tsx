"use client"

import { useState } from "react"
import type { Packet } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface PacketInspectorProps {
  packets: Packet[]
  selectedPacket: Packet | null
  onPacketSelect: (packet: Packet | null) => void
}

export function PacketInspector({ packets, selectedPacket, onPacketSelect }: PacketInspectorProps) {
  const [filter, setFilter] = useState<string>("all")

  const filteredPackets = packets.filter((packet) => {
    if (filter === "all") return true
    return packet.type === filter
  })

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-medium mb-2">Inspector de Paquetes</h3>
        <div className="flex space-x-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            Todos
          </Button>
          <Button variant={filter === "icmp" ? "default" : "outline"} size="sm" onClick={() => setFilter("icmp")}>
            ICMP
          </Button>
          <Button variant={filter === "tcp" ? "default" : "outline"} size="sm" onClick={() => setFilter("tcp")}>
            TCP
          </Button>
          <Button variant={filter === "udp" ? "default" : "outline"} size="sm" onClick={() => setFilter("udp")}>
            UDP
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="w-1/2 border-r">
          <ScrollArea className="h-full">
            <div className="p-2">
              {filteredPackets.length === 0 ? (
                <div className="text-center text-gray-500 p-4">No hay paquetes para mostrar</div>
              ) : (
                <div className="space-y-1">
                  {filteredPackets.map((packet) => (
                    <div
                      key={packet.id}
                      className={`p-2 rounded text-xs cursor-pointer ${
                        selectedPacket?.id === packet.id
                          ? "bg-blue-100 border-blue-300 border"
                          : "hover:bg-gray-100 border border-transparent"
                      }`}
                      onClick={() => onPacketSelect(packet)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">
                          {packet.type.toUpperCase()} {packet.subtype}
                        </div>
                        <div className="text-gray-500">{new Date(packet.timestamp).toLocaleTimeString()}</div>
                      </div>
                      <div className="mt-1">
                        {packet.sourceIp} → {packet.destinationIp}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="w-1/2">
          <ScrollArea className="h-full">
            {selectedPacket ? (
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium">Detalles del Paquete</h3>
                  <Button variant="ghost" size="icon" onClick={() => onPacketSelect(null)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-3 gap-1">
                    <div className="font-medium">ID:</div>
                    <div className="col-span-2">{selectedPacket.id}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    <div className="font-medium">Tipo:</div>
                    <div className="col-span-2">{selectedPacket.type.toUpperCase()}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    <div className="font-medium">Subtipo:</div>
                    <div className="col-span-2">{selectedPacket.subtype}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    <div className="font-medium">Origen:</div>
                    <div className="col-span-2">{selectedPacket.sourceIp}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    <div className="font-medium">Destino:</div>
                    <div className="col-span-2">{selectedPacket.destinationIp}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    <div className="font-medium">Tamaño:</div>
                    <div className="col-span-2">{selectedPacket.size} bytes</div>
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    <div className="font-medium">TTL:</div>
                    <div className="col-span-2">{selectedPacket.ttl}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    <div className="font-medium">Estado:</div>
                    <div className="col-span-2">
                      {selectedPacket.status === "in-transit"
                        ? "En tránsito"
                        : selectedPacket.status === "delivered"
                          ? "Entregado"
                          : selectedPacket.status === "dropped"
                            ? "Descartado"
                            : "Desconocido"}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    <div className="font-medium">Hora:</div>
                    <div className="col-span-2">{new Date(selectedPacket.timestamp).toLocaleTimeString()}</div>
                  </div>

                  <div className="mt-4">
                    <div className="font-medium mb-1">Contenido:</div>
                    <div className="p-2 bg-gray-100 rounded font-mono text-xs">{selectedPacket.content}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Seleccione un paquete para ver sus detalles
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
