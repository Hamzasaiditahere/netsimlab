import type { DeviceType, DeviceInterface, DeviceConfig } from "@/lib/types"

export function generateDeviceConfig(type: DeviceType, deviceId: string, index: number) {
  let name = ""
  let interfaces: DeviceInterface[] = []
  let config: DeviceConfig

  switch (type) {
    case "router":
      name = `Router-${index}`
      interfaces = [
        {
          id: `${deviceId}-eth0`,
          name: "GigabitEthernet0/0",
          type: "ethernet",
          connectedTo: null,
          connectedToInterface: null,
          connectionId: null,
          status: "down",
          supportsFiber: true,
          supportsSerial: false,
        },
        {
          id: `${deviceId}-eth1`,
          name: "GigabitEthernet0/1",
          type: "ethernet",
          connectedTo: null,
          connectedToInterface: null,
          connectionId: null,
          status: "down",
          supportsFiber: true,
          supportsSerial: false,
        },
        {
          id: `${deviceId}-serial0`,
          name: "Serial0/0",
          type: "serial",
          connectedTo: null,
          connectedToInterface: null,
          connectionId: null,
          status: "down",
          supportsFiber: false,
          supportsSerial: true,
        },
        {
          id: `${deviceId}-console`,
          name: "Console",
          type: "console",
          connectedTo: null,
          connectedToInterface: null,
          connectionId: null,
          status: "down",
          supportsFiber: false,
          supportsSerial: false,
        },
      ]
      config = {
        hostname: name,
        routes: [],
      }
      break

    case "switch":
      name = `Switch-${index}`
      interfaces = [
        {
          id: `${deviceId}-port1`,
          name: "FastEthernet0/1",
          type: "ethernet",
          connectedTo: null,
          connectedToInterface: null,
          connectionId: null,
          status: "down",
          supportsFiber: false,
          supportsSerial: false,
        },
        {
          id: `${deviceId}-port2`,
          name: "FastEthernet0/2",
          type: "ethernet",
          connectedTo: null,
          connectedToInterface: null,
          connectionId: null,
          status: "down",
          supportsFiber: false,
          supportsSerial: false,
        },
        {
          id: `${deviceId}-port3`,
          name: "FastEthernet0/3",
          type: "ethernet",
          connectedTo: null,
          connectedToInterface: null,
          connectionId: null,
          status: "down",
          supportsFiber: false,
          supportsSerial: false,
        },
        {
          id: `${deviceId}-port4`,
          name: "FastEthernet0/4",
          type: "ethernet",
          connectedTo: null,
          connectedToInterface: null,
          connectionId: null,
          status: "down",
          supportsFiber: false,
          supportsSerial: false,
        },
        {
          id: `${deviceId}-gigabit1`,
          name: "GigabitEthernet0/1",
          type: "ethernet",
          connectedTo: null,
          connectedToInterface: null,
          connectionId: null,
          status: "down",
          supportsFiber: true,
          supportsSerial: false,
        },
        {
          id: `${deviceId}-console`,
          name: "Console",
          type: "console",
          connectedTo: null,
          connectedToInterface: null,
          connectionId: null,
          status: "down",
          supportsFiber: false,
          supportsSerial: false,
        },
      ]
      config = {
        hostname: name,
        vlans: [],
      }
      break

    case "pc":
      name = `PC-${index}`
      interfaces = [
        {
          id: `${deviceId}-eth0`,
          name: "Ethernet",
          type: "ethernet",
          connectedTo: null,
          connectedToInterface: null,
          connectionId: null,
          status: "down",
          supportsFiber: false,
          supportsSerial: false,
        },
        {
          id: `${deviceId}-wifi`,
          name: "Wi-Fi",
          type: "wireless",
          connectedTo: null,
          connectedToInterface: null,
          connectionId: null,
          status: "down",
          supportsFiber: false,
          supportsSerial: false,
        },
      ]
      config = {
        hostname: name,
        defaultGateway: "",
        dnsServer: "",
      }
      break

    case "server":
      name = `Server-${index}`
      interfaces = [
        {
          id: `${deviceId}-eth0`,
          name: "Ethernet0",
          type: "ethernet",
          connectedTo: null,
          connectedToInterface: null,
          connectionId: null,
          status: "down",
          supportsFiber: false,
          supportsSerial: false,
        },
        {
          id: `${deviceId}-eth1`,
          name: "Ethernet1",
          type: "ethernet",
          connectedTo: null,
          connectedToInterface: null,
          connectionId: null,
          status: "down",
          supportsFiber: false,
          supportsSerial: false,
        },
      ]
      config = {
        hostname: name,
        defaultGateway: "",
        dnsServer: "",
        services: [
          {
            id: `${deviceId}-dhcp`,
            name: "DHCP Server",
            type: "dhcp",
            enabled: false,
            description: "Asigna direcciones IP automáticamente",
          },
          {
            id: `${deviceId}-dns`,
            name: "DNS Server",
            type: "dns",
            enabled: false,
            description: "Resuelve nombres de dominio",
          },
          {
            id: `${deviceId}-http`,
            name: "HTTP Server",
            type: "http",
            enabled: false,
            description: "Sirve páginas web",
          },
          {
            id: `${deviceId}-ftp`,
            name: "FTP Server",
            type: "ftp",
            enabled: false,
            description: "Transferencia de archivos",
          },
        ],
      }
      break

    case "camera":
      name = `Camera-${index}`
      interfaces = [
        {
          id: `${deviceId}-eth0`,
          name: "Ethernet",
          type: "ethernet",
          connectedTo: null,
          connectedToInterface: null,
          connectionId: null,
          status: "down",
          supportsFiber: false,
          supportsSerial: false,
        },
        {
          id: `${deviceId}-wifi`,
          name: "Wi-Fi",
          type: "wireless",
          connectedTo: null,
          connectedToInterface: null,
          connectionId: null,
          status: "down",
          supportsFiber: false,
          supportsSerial: false,
        },
      ]
      config = {
        hostname: name,
        defaultGateway: "",
      }
      break

    case "smartphone":
      name = `Phone-${index}`
      interfaces = [
        {
          id: `${deviceId}-wifi`,
          name: "Wi-Fi",
          type: "wireless",
          connectedTo: null,
          connectedToInterface: null,
          connectionId: null,
          status: "down",
          supportsFiber: false,
          supportsSerial: false,
        },
      ]
      config = {
        hostname: name,
        defaultGateway: "",
      }
      break

    case "access-point":
      name = `AP-${index}`
      interfaces = [
        {
          id: `${deviceId}-eth0`,
          name: "Ethernet",
          type: "ethernet",
          connectedTo: null,
          connectedToInterface: null,
          connectionId: null,
          status: "down",
          supportsFiber: false,
          supportsSerial: false,
        },
        {
          id: `${deviceId}-wifi`,
          name: "Wi-Fi",
          type: "wireless",
          connectedTo: null,
          connectedToInterface: null,
          connectionId: null,
          status: "down",
          supportsFiber: false,
          supportsSerial: false,
        },
      ]
      config = {
        hostname: name,
        defaultGateway: "",
      }
      break

    default:
      name = `Device-${index}`
      interfaces = [
        {
          id: `${deviceId}-eth0`,
          name: "Ethernet",
          type: "ethernet",
          connectedTo: null,
          connectedToInterface: null,
          connectionId: null,
          status: "down",
          supportsFiber: false,
          supportsSerial: false,
        },
      ]
      config = {
        hostname: name,
      }
  }

  return { name, interfaces, config }
}
