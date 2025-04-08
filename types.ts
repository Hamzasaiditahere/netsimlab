export type DeviceType = "router" | "switch" | "pc" | "server" | "camera" | "smartphone" | "access-point"

export type SimulationMode = "design" | "simulation" | "physical"

export type CableType = "ethernet" | "crossover" | "serial" | "fiber" | "console"

export interface DeviceInterface {
  id: string
  name: string
  ipAddress?: string
  subnetMask?: string
  macAddress?: string
  type: "ethernet" | "serial" | "fiber" | "console" | "wireless"
  connectedTo: string | null
  connectedToInterface: string | null
  connectionId: string | null
  status?: "up" | "down"
  supportsFiber?: boolean
  supportsSerial?: boolean
}

export interface RouterConfig {
  hostname: string
  routes: Array<{
    id: string
    network: string
    netmask: string
    gateway: string
    interface: string
    metric: number
  }>
}

export interface SwitchConfig {
  hostname: string
  vlans: Array<{
    id: number
    name: string
    ports: string[]
  }>
}

export interface ServerConfig {
  hostname: string
  defaultGateway?: string
  dnsServer?: string
  services: Array<{
    id: string
    name: string
    type: "dhcp" | "dns" | "http" | "ftp"
    enabled: boolean
    description: string
  }>
}

export interface PcConfig {
  hostname: string
  defaultGateway?: string
  dnsServer?: string
}

export interface IoTDeviceConfig {
  hostname: string
  defaultGateway?: string
}

export type DeviceConfig = RouterConfig | SwitchConfig | ServerConfig | PcConfig | IoTDeviceConfig

export interface Device {
  id: string
  type: DeviceType
  name: string
  x: number
  y: number
  interfaces: DeviceInterface[]
  config: DeviceConfig
  status: "on" | "off"
}

export interface Connection {
  id: string
  sourceDeviceId: string
  sourceInterfaceId: string
  targetDeviceId: string
  targetInterfaceId: string
  type: CableType
  status: "up" | "down"
  bandwidth: number // Mbps
  latency: number // ms
}

export interface Packet {
  id: string
  type: "icmp" | "tcp" | "udp" | "arp" | "dhcp"
  subtype: string
  sourceDeviceId: string
  sourceIp: string
  destinationDeviceId: string
  destinationIp: string
  size: number
  ttl: number
  content: string
  timestamp: Date
  path: string[]
  status: "in-transit" | "delivered" | "dropped"
}

export interface LogEntry {
  id: string
  timestamp: Date
  type: "system" | "error" | "info" | "command"
  message: string
}
