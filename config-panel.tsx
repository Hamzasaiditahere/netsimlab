"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Device, SimulationMode } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Save, RefreshCw, AlertTriangle, Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ConfigPanelProps {
  device: Device
  onUpdateDevice: (device: Device) => void
  simulationMode: SimulationMode
}

export function ConfigPanel({ device, onUpdateDevice, simulationMode }: ConfigPanelProps) {
  const [localDevice, setLocalDevice] = useState<Device>(device)
  const [hasChanges, setHasChanges] = useState(false)

  // Update local state when selected device changes
  useEffect(() => {
    setLocalDevice(device)
    setHasChanges(false)
  }, [device])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalDevice((prev) => ({
      ...prev,
      name: e.target.value,
    }))
    setHasChanges(true)
  }

  const handleHostnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalDevice((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        hostname: e.target.value,
      },
    }))
    setHasChanges(true)
  }

  const handleIpAddressChange = (interfaceId: string, value: string) => {
    setLocalDevice((prev) => ({
      ...prev,
      interfaces: prev.interfaces.map((intf) => (intf.id === interfaceId ? { ...intf, ipAddress: value } : intf)),
    }))
    setHasChanges(true)
  }

  const handleSubnetMaskChange = (interfaceId: string, value: string) => {
    setLocalDevice((prev) => ({
      ...prev,
      interfaces: prev.interfaces.map((intf) => (intf.id === interfaceId ? { ...intf, subnetMask: value } : intf)),
    }))
    setHasChanges(true)
  }

  const handleInterfaceStatusChange = (interfaceId: string, value: "up" | "down") => {
    setLocalDevice((prev) => ({
      ...prev,
      interfaces: prev.interfaces.map((intf) => (intf.id === interfaceId ? { ...intf, status: value } : intf)),
    }))
    setHasChanges(true)
  }

  const handleAddRoute = () => {
    if (device.type !== "router") return

    setLocalDevice((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        routes: [
          ...(prev.config.routes || []),
          {
            id: `route-${Date.now()}`,
            network: "0.0.0.0",
            netmask: "0.0.0.0",
            gateway: "",
            interface: prev.interfaces[0]?.id || "",
            metric: 1,
          },
        ],
      },
    }))
    setHasChanges(true)
  }

  const handleRouteChange = (routeId: string, field: string, value: string | number) => {
    if (device.type !== "router") return

    setLocalDevice((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        routes: (prev.config.routes || []).map((route) =>
          route.id === routeId ? { ...route, [field]: value } : route,
        ),
      },
    }))
    setHasChanges(true)
  }

  const handleDeleteRoute = (routeId: string) => {
    if (device.type !== "router") return

    setLocalDevice((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        routes: (prev.config.routes || []).filter((route) => route.id !== routeId),
      },
    }))
    setHasChanges(true)
  }

  const handleServiceToggle = (serviceId: string, enabled: boolean) => {
    if (device.type !== "server") return

    setLocalDevice((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        services: (prev.config.services || []).map((service) =>
          service.id === serviceId ? { ...service, enabled } : service,
        ),
      },
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    onUpdateDevice(localDevice)
    setHasChanges(false)
  }

  const handleReset = () => {
    setLocalDevice(device)
    setHasChanges(false)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold">Configuración de Dispositivo</h2>
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Descartar
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-1" />
                Guardar
              </Button>
            </>
          )}
        </div>
      </div>

      {simulationMode === "simulation" && device.status === "off" && (
        <Alert variant="destructive" className="m-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Dispositivo apagado</AlertTitle>
          <AlertDescription>
            Este dispositivo está apagado. Enciéndalo para configurarlo durante la simulación.
          </AlertDescription>
        </Alert>
      )}

      <ScrollArea className="flex-1">
        <Tabs defaultValue="basic" className="p-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="interfaces">Interfaces</TabsTrigger>
            <TabsTrigger value="advanced">Avanzado</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="device-name">Nombre del Dispositivo</Label>
              <Input
                id="device-name"
                value={localDevice.name}
                onChange={handleNameChange}
                disabled={simulationMode === "simulation" && device.status === "off"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hostname">Hostname</Label>
              <Input
                id="hostname"
                value={localDevice.config.hostname || ""}
                onChange={handleHostnameChange}
                disabled={simulationMode === "simulation" && device.status === "off"}
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de Dispositivo</Label>
              <div className="text-sm text-gray-700 p-2 bg-gray-100 rounded">
                {device.type === "router" && "Router"}
                {device.type === "switch" && "Switch"}
                {device.type === "pc" && "PC"}
                {device.type === "server" && "Servidor"}
                {device.type === "camera" && "Cámara IP"}
                {device.type === "smartphone" && "Smartphone"}
                {device.type === "access-point" && "Punto de Acceso"}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Estado</Label>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${device.status === "on" ? "bg-green-500" : "bg-gray-400"}`} />
                <span className="text-sm">{device.status === "on" ? "Encendido" : "Apagado"}</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="interfaces" className="space-y-4 mt-4">
            {localDevice.interfaces.map((intf) => (
              <div key={intf.id} className="space-y-3 p-3 border rounded-md">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`interface-${intf.id}`} className="font-medium">
                    {intf.name}
                  </Label>

                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        intf.connectedTo ? (intf.status === "up" ? "bg-green-500" : "bg-red-500") : "bg-gray-300"
                      }`}
                    />
                    <span className="text-xs text-gray-500">
                      {intf.connectedTo ? (intf.status === "up" ? "Conectado" : "Desconectado") : "No conectado"}
                    </span>
                  </div>
                </div>

                {intf.connectedTo && (
                  <div className="text-xs text-gray-500">
                    Conectado a:{" "}
                    {localDevice.interfaces.find((i) => i.id === intf.connectedToInterface)?.name || "Desconocido"}
                  </div>
                )}

                {(device.type === "router" ||
                  device.type === "pc" ||
                  device.type === "server" ||
                  device.type === "camera") && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor={`ip-${intf.id}`} className="text-xs">
                          Dirección IP
                        </Label>
                        <Input
                          id={`ip-${intf.id}`}
                          value={intf.ipAddress || ""}
                          onChange={(e) => handleIpAddressChange(intf.id, e.target.value)}
                          placeholder="192.168.1.1"
                          className="h-8 text-sm"
                          disabled={simulationMode === "simulation" && device.status === "off"}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`mask-${intf.id}`} className="text-xs">
                          Máscara de Subred
                        </Label>
                        <Input
                          id={`mask-${intf.id}`}
                          value={intf.subnetMask || ""}
                          onChange={(e) => handleSubnetMaskChange(intf.id, e.target.value)}
                          placeholder="255.255.255.0"
                          className="h-8 text-sm"
                          disabled={simulationMode === "simulation" && device.status === "off"}
                        />
                      </div>
                    </div>

                    {intf.connectedTo && (
                      <div className="flex items-center space-x-2 pt-1">
                        <Label htmlFor={`status-${intf.id}`} className="text-xs">
                          Estado:
                        </Label>
                        <Select
                          value={intf.status || "down"}
                          onValueChange={(value) => handleInterfaceStatusChange(intf.id, value as "up" | "down")}
                          disabled={simulationMode === "simulation" && device.status === "off"}
                        >
                          <SelectTrigger className="h-7 w-24 text-xs">
                            <SelectValue placeholder="Estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="up">Activo</SelectItem>
                            <SelectItem value="down">Inactivo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-4">
            {device.type === "router" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Tabla de Enrutamiento</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddRoute}
                    disabled={simulationMode === "simulation" && device.status === "off"}
                  >
                    + Añadir Ruta
                  </Button>
                </div>

                {(localDevice.config.routes || []).length === 0 ? (
                  <div className="text-sm text-gray-500 p-4 text-center border rounded-md">
                    No hay rutas configuradas
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(localDevice.config.routes || []).map((route) => (
                      <div key={route.id} className="p-3 border rounded-md">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Red</Label>
                            <Input
                              value={route.network}
                              onChange={(e) => handleRouteChange(route.id, "network", e.target.value)}
                              placeholder="192.168.1.0"
                              className="h-8 text-sm"
                              disabled={simulationMode === "simulation" && device.status === "off"}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Máscara</Label>
                            <Input
                              value={route.netmask}
                              onChange={(e) => handleRouteChange(route.id, "netmask", e.target.value)}
                              placeholder="255.255.255.0"
                              className="h-8 text-sm"
                              disabled={simulationMode === "simulation" && device.status === "off"}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Gateway</Label>
                            <Input
                              value={route.gateway || ""}
                              onChange={(e) => handleRouteChange(route.id, "gateway", e.target.value)}
                              placeholder="192.168.1.1"
                              className="h-8 text-sm"
                              disabled={simulationMode === "simulation" && device.status === "off"}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Interfaz</Label>
                            <Select
                              value={route.interface}
                              onValueChange={(value) => handleRouteChange(route.id, "interface", value)}
                              disabled={simulationMode === "simulation" && device.status === "off"}
                            >
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue placeholder="Interfaz" />
                              </SelectTrigger>
                              <SelectContent>
                                {localDevice.interfaces.map((intf) => (
                                  <SelectItem key={intf.id} value={intf.id}>
                                    {intf.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex justify-end mt-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteRoute(route.id)}
                            disabled={simulationMode === "simulation" && device.status === "off"}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {device.type === "switch" && (
              <div className="space-y-4">
                <Label htmlFor="vlans" className="font-medium">
                  Configuración de VLANs
                </Label>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Funcionalidad en desarrollo</AlertTitle>
                  <AlertDescription>
                    La configuración de VLANs estará disponible en una próxima actualización.
                  </AlertDescription>
                </Alert>
                <Textarea id="vlans" placeholder="Configuración de VLANs" className="h-40" disabled={true} />
              </div>
            )}

            {device.type === "server" && (
              <div className="space-y-4">
                <Label className="font-medium">Servicios</Label>
                <div className="space-y-3">
                  {(localDevice.config.services || []).map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <div className="font-medium text-sm">{service.name}</div>
                        <div className="text-xs text-gray-500">{service.description}</div>
                      </div>
                      <Switch
                        checked={service.enabled}
                        onCheckedChange={(checked) => handleServiceToggle(service.id, checked)}
                        disabled={simulationMode === "simulation" && device.status === "off"}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {device.type === "pc" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default-gateway">Gateway Predeterminado</Label>
                  <Input
                    id="default-gateway"
                    value={localDevice.config.defaultGateway || ""}
                    onChange={(e) => {
                      setLocalDevice((prev) => ({
                        ...prev,
                        config: {
                          ...prev.config,
                          defaultGateway: e.target.value,
                        },
                      }))
                      setHasChanges(true)
                    }}
                    placeholder="192.168.1.1"
                    disabled={simulationMode === "simulation" && device.status === "off"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dns-server">Servidor DNS</Label>
                  <Input
                    id="dns-server"
                    value={localDevice.config.dnsServer || ""}
                    onChange={(e) => {
                      setLocalDevice((prev) => ({
                        ...prev,
                        config: {
                          ...prev.config,
                          dnsServer: e.target.value,
                        },
                      }))
                      setHasChanges(true)
                    }}
                    placeholder="8.8.8.8"
                    disabled={simulationMode === "simulation" && device.status === "off"}
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  )
}
