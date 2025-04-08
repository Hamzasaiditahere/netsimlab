"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Info, Laptop, Network, Router, Zap, Terminal, Settings, Box } from "lucide-react"
import { useSettings } from "@/lib/settings-context"

interface DocumentationPanelProps {
  onClose: () => void
}

export function DocumentationPanel({ onClose }: DocumentationPanelProps) {
  const { language } = useSettings()
  const [activeTab, setActiveTab] = useState("getting-started")

  // Translations
  const t = {
    title: language === "es" ? "Documentación de NetSimLab" : "NetSimLab Documentation",
    close: language === "es" ? "Cerrar" : "Close",
    tabs: {
      gettingStarted: language === "es" ? "Primeros Pasos" : "Getting Started",
      devices: language === "es" ? "Dispositivos" : "Devices",
      connections: language === "es" ? "Conexiones" : "Connections",
      configuration: language === "es" ? "Configuración" : "Configuration",
      simulation: language === "es" ? "Simulación" : "Simulation",
      commands: language === "es" ? "Comandos" : "Commands",
    },
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-[900px] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <Info className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-xl font-bold">{t.title}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="px-4 pt-2 justify-start border-b rounded-none gap-2 overflow-x-auto">
            <TabsTrigger value="getting-started" className="data-[state=active]:bg-gray-100">
              {t.tabs.gettingStarted}
            </TabsTrigger>
            <TabsTrigger value="devices" className="data-[state=active]:bg-gray-100">
              {t.tabs.devices}
            </TabsTrigger>
            <TabsTrigger value="connections" className="data-[state=active]:bg-gray-100">
              {t.tabs.connections}
            </TabsTrigger>
            <TabsTrigger value="configuration" className="data-[state=active]:bg-gray-100">
              {t.tabs.configuration}
            </TabsTrigger>
            <TabsTrigger value="simulation" className="data-[state=active]:bg-gray-100">
              {t.tabs.simulation}
            </TabsTrigger>
            <TabsTrigger value="commands" className="data-[state=active]:bg-gray-100">
              {t.tabs.commands}
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden relative">
            <ScrollArea className="h-full" id="docs-scroll-area">
              <div className="p-6">
                {/* Getting Started */}
                <TabsContent value="getting-started" className="mt-0">
                  <h3 className="text-lg font-semibold mb-4">
                    {language === "es" ? "Bienvenido a NetSimLab" : "Welcome to NetSimLab"}
                  </h3>
                  <p className="mb-4">
                    {language === "es"
                      ? "NetSimLab es un simulador de redes que le permite diseñar, configurar y probar redes virtuales. Esta guía le ayudará a comenzar a utilizar el simulador."
                      : "NetSimLab is a network simulator that allows you to design, configure, and test virtual networks. This guide will help you get started with the simulator."}
                  </p>

                  <h4 className="font-medium text-md mt-6 mb-2">
                    {language === "es" ? "Interfaz Principal" : "Main Interface"}
                  </h4>
                  <p className="mb-4">
                    {language === "es"
                      ? "La interfaz de NetSimLab se divide en tres secciones principales:"
                      : "The NetSimLab interface is divided into three main sections:"}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>
                      <strong>{language === "es" ? "Panel de Dispositivos" : "Device Panel"}</strong>:{" "}
                      {language === "es"
                        ? "A la izquierda, donde puede seleccionar dispositivos y cables para añadir a su red."
                        : "On the left, where you can select devices and cables to add to your network."}
                    </li>
                    <li>
                      <strong>{language === "es" ? "Lienzo de Red" : "Network Canvas"}</strong>:{" "}
                      {language === "es"
                        ? "En el centro, donde puede organizar y conectar sus dispositivos."
                        : "In the center, where you can arrange and connect your devices."}
                    </li>
                    <li>
                      <strong>{language === "es" ? "Panel de Configuración" : "Configuration Panel"}</strong>:{" "}
                      {language === "es"
                        ? "A la derecha, donde puede configurar los dispositivos seleccionados y ver información sobre la red."
                        : "On the right, where you can configure selected devices and view information about the network."}
                    </li>
                  </ul>

                  <h4 className="font-medium text-md mt-6 mb-2">
                    {language === "es" ? "Flujo de Trabajo Básico" : "Basic Workflow"}
                  </h4>
                  <ol className="list-decimal pl-6 space-y-2 mb-4">
                    <li>
                      {language === "es"
                        ? "Arrastre dispositivos desde el panel izquierdo al lienzo central."
                        : "Drag devices from the left panel to the central canvas."}
                    </li>
                    <li>
                      {language === "es"
                        ? "Seleccione un tipo de cable y haga clic en los puertos de los dispositivos para conectarlos."
                        : "Select a cable type and click on device ports to connect them."}
                    </li>
                    <li>
                      {language === "es"
                        ? "Haga clic en un dispositivo para configurarlo en el panel derecho."
                        : "Click on a device to configure it in the right panel."}
                    </li>
                    <li>
                      {language === "es"
                        ? "Inicie la simulación para probar su red."
                        : "Start the simulation to test your network."}
                    </li>
                    <li>
                      {language === "es"
                        ? "Use la consola para ejecutar comandos como ping o show interfaces."
                        : "Use the console to run commands like ping or show interfaces."}
                    </li>
                  </ol>

                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
                    <h4 className="font-medium text-md mb-2 flex items-center">
                      <Info className="w-4 h-4 mr-2 text-blue-600" />
                      {language === "es" ? "Consejo" : "Tip"}
                    </h4>
                    <p>
                      {language === "es"
                        ? "Puede guardar y cargar sus topologías de red utilizando los botones Guardar y Cargar en la parte superior de la interfaz."
                        : "You can save and load your network topologies using the Save and Load buttons at the top of the interface."}
                    </p>
                  </div>
                </TabsContent>

                {/* Devices */}
                <TabsContent value="devices" className="mt-0">
                  <h3 className="text-lg font-semibold mb-4">
                    {language === "es" ? "Dispositivos de Red" : "Network Devices"}
                  </h3>
                  <p className="mb-4">
                    {language === "es"
                      ? "NetSimLab incluye varios tipos de dispositivos que puede utilizar para construir su red:"
                      : "NetSimLab includes several types of devices you can use to build your network:"}
                  </p>

                  <div className="space-y-6">
                    <div className="border rounded-md p-4">
                      <div className="flex items-center mb-2">
                        <Router className="w-6 h-6 mr-2 text-gray-700" />
                        <h4 className="font-medium text-md">{language === "es" ? "Router" : "Router"}</h4>
                      </div>
                      <p className="mb-2">
                        {language === "es"
                          ? "Dispositivo de capa 3 que enruta paquetes entre diferentes redes."
                          : "Layer 3 device that routes packets between different networks."}
                      </p>
                      <ul className="list-disc pl-6 text-sm">
                        <li>
                          {language === "es"
                            ? "Interfaces: GigabitEthernet, Serial"
                            : "Interfaces: GigabitEthernet, Serial"}
                        </li>
                        <li>
                          {language === "es" ? "Funciones: Enrutamiento, NAT, ACLs" : "Features: Routing, NAT, ACLs"}
                        </li>
                        <li>
                          {language === "es"
                            ? "Configuración: Direcciones IP, tabla de enrutamiento"
                            : "Configuration: IP addresses, routing table"}
                        </li>
                      </ul>
                    </div>

                    <div className="border rounded-md p-4">
                      <div className="flex items-center mb-2">
                        <Network className="w-6 h-6 mr-2 text-gray-700" />
                        <h4 className="font-medium text-md">{language === "es" ? "Switch" : "Switch"}</h4>
                      </div>
                      <p className="mb-2">
                        {language === "es"
                          ? "Dispositivo de capa 2 que conecta dispositivos en una red local."
                          : "Layer 2 device that connects devices in a local network."}
                      </p>
                      <ul className="list-disc pl-6 text-sm">
                        <li>
                          {language === "es"
                            ? "Interfaces: FastEthernet, GigabitEthernet"
                            : "Interfaces: FastEthernet, GigabitEthernet"}
                        </li>
                        <li>{language === "es" ? "Funciones: VLANs, STP" : "Features: VLANs, STP"}</li>
                        <li>
                          {language === "es"
                            ? "Configuración: VLANs, puertos troncales"
                            : "Configuration: VLANs, trunk ports"}
                        </li>
                      </ul>
                    </div>

                    <div className="border rounded-md p-4">
                      <div className="flex items-center mb-2">
                        <Laptop className="w-6 h-6 mr-2 text-gray-700" />
                        <h4 className="font-medium text-md">{language === "es" ? "PC" : "PC"}</h4>
                      </div>
                      <p className="mb-2">
                        {language === "es"
                          ? "Dispositivo final que puede enviar y recibir paquetes."
                          : "End device that can send and receive packets."}
                      </p>
                      <ul className="list-disc pl-6 text-sm">
                        <li>{language === "es" ? "Interfaces: Ethernet, Wi-Fi" : "Interfaces: Ethernet, Wi-Fi"}</li>
                        <li>
                          {language === "es" ? "Funciones: Ping, navegación web" : "Features: Ping, web browsing"}
                        </li>
                        <li>
                          {language === "es"
                            ? "Configuración: Dirección IP, gateway, DNS"
                            : "Configuration: IP address, gateway, DNS"}
                        </li>
                      </ul>
                    </div>

                    <div className="border rounded-md p-4">
                      <div className="flex items-center mb-2">
                        <div className="flex space-x-4">
                          <div>
                            <h5 className="font-medium text-sm mb-1">
                              {language === "es" ? "Otros Dispositivos" : "Other Devices"}
                            </h5>
                            <ul className="list-disc pl-6 text-sm">
                              <li>
                                {language === "es" ? "Servidor" : "Server"} -{" "}
                                {language === "es" ? "Servicios DHCP, DNS, HTTP" : "DHCP, DNS, HTTP services"}
                              </li>
                              <li>
                                {language === "es" ? "Cámara IP" : "IP Camera"} -{" "}
                                {language === "es"
                                  ? "Dispositivo IoT de videovigilancia"
                                  : "IoT video surveillance device"}
                              </li>
                              <li>
                                {language === "es" ? "Smartphone" : "Smartphone"} -{" "}
                                {language === "es" ? "Cliente móvil con Wi-Fi" : "Mobile client with Wi-Fi"}
                              </li>
                              <li>
                                {language === "es" ? "Punto de Acceso" : "Access Point"} -{" "}
                                {language === "es" ? "Conectividad inalámbrica" : "Wireless connectivity"}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h4 className="font-medium text-md mt-6 mb-2">
                    {language === "es" ? "Añadir Dispositivos" : "Adding Devices"}
                  </h4>
                  <p>
                    {language === "es"
                      ? "Para añadir un dispositivo, arrástrelo desde el panel de dispositivos al lienzo o haga clic en él para añadirlo automáticamente. Los dispositivos se pueden mover arrastrándolos por el lienzo."
                      : "To add a device, drag it from the device panel to the canvas or click on it to add it automatically. Devices can be moved by dragging them around the canvas."}
                  </p>
                </TabsContent>

                {/* Connections */}
                <TabsContent value="connections" className="mt-0">
                  <h3 className="text-lg font-semibold mb-4">
                    {language === "es" ? "Conexiones de Red" : "Network Connections"}
                  </h3>
                  <p className="mb-4">
                    {language === "es"
                      ? "Las conexiones permiten que los dispositivos se comuniquen entre sí. NetSimLab ofrece varios tipos de cables para diferentes escenarios de conexión."
                      : "Connections allow devices to communicate with each other. NetSimLab offers several types of cables for different connection scenarios."}
                  </p>

                  <h4 className="font-medium text-md mt-6 mb-2">
                    {language === "es" ? "Tipos de Cables" : "Cable Types"}
                  </h4>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center border rounded-md p-3">
                      <div className="w-8 h-1 bg-blue-500 mr-3"></div>
                      <div>
                        <h5 className="font-medium">{language === "es" ? "Cable Ethernet" : "Ethernet Cable"}</h5>
                        <p className="text-sm text-gray-600">
                          {language === "es"
                            ? "Para conectar PC a switch, router a switch. Velocidad: 100 Mbps."
                            : "For connecting PC to switch, router to switch. Speed: 100 Mbps."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center border rounded-md p-3">
                      <div className="w-8 h-1 bg-orange-500 mr-3"></div>
                      <div>
                        <h5 className="font-medium">{language === "es" ? "Cable Cruzado" : "Crossover Cable"}</h5>
                        <p className="text-sm text-gray-600">
                          {language === "es"
                            ? "Para conectar switch a switch, router a router. Velocidad: 100 Mbps."
                            : "For connecting switch to switch, router to router. Speed: 100 Mbps."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center border rounded-md p-3">
                      <div className="w-8 h-1 bg-green-500 mr-3"></div>
                      <div>
                        <h5 className="font-medium">{language === "es" ? "Cable Serial" : "Serial Cable"}</h5>
                        <p className="text-sm text-gray-600">
                          {language === "es"
                            ? "Para conexiones WAN entre routers. Velocidad: 10 Mbps."
                            : "For WAN connections between routers. Speed: 10 Mbps."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center border rounded-md p-3">
                      <div className="w-8 h-1 bg-purple-500 mr-3"></div>
                      <div>
                        <h5 className="font-medium">{language === "es" ? "Cable de Fibra" : "Fiber Cable"}</h5>
                        <p className="text-sm text-gray-600">
                          {language === "es"
                            ? "Para conexiones de alta velocidad. Velocidad: 1000 Mbps."
                            : "For high-speed connections. Speed: 1000 Mbps."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center border rounded-md p-3">
                      <div className="w-8 h-1 bg-gray-500 mr-3"></div>
                      <div>
                        <h5 className="font-medium">{language === "es" ? "Cable de Consola" : "Console Cable"}</h5>
                        <p className="text-sm text-gray-600">
                          {language === "es"
                            ? "Para configuración de dispositivos. No transmite datos de red."
                            : "For device configuration. Does not transmit network data."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <h4 className="font-medium text-md mt-6 mb-2">
                    {language === "es" ? "Crear Conexiones" : "Creating Connections"}
                  </h4>
                  <ol className="list-decimal pl-6 space-y-2 mb-4">
                    <li>
                      {language === "es"
                        ? "Seleccione un tipo de cable en la pestaña 'Cables' del panel izquierdo."
                        : "Select a cable type in the 'Cables' tab of the left panel."}
                    </li>
                    <li>
                      {language === "es"
                        ? "Haga clic en una interfaz (puerto) del primer dispositivo."
                        : "Click on an interface (port) of the first device."}
                    </li>
                    <li>
                      {language === "es"
                        ? "Haga clic en una interfaz del segundo dispositivo para completar la conexión."
                        : "Click on an interface of the second device to complete the connection."}
                    </li>
                  </ol>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-4">
                    <h4 className="font-medium text-md mb-2 flex items-center">
                      <Info className="w-4 h-4 mr-2 text-yellow-600" />
                      {language === "es" ? "Importante" : "Important"}
                    </h4>
                    <p>
                      {language === "es"
                        ? "No todas las interfaces son compatibles con todos los tipos de cables. Por ejemplo, las interfaces de fibra solo pueden conectarse con cables de fibra, y las interfaces seriales solo con cables seriales."
                        : "Not all interfaces are compatible with all cable types. For example, fiber interfaces can only connect with fiber cables, and serial interfaces only with serial cables."}
                    </p>
                  </div>
                </TabsContent>

                {/* Configuration */}
                <TabsContent value="configuration" className="mt-0">
                  <h3 className="text-lg font-semibold mb-4">
                    {language === "es" ? "Configuración de Dispositivos" : "Device Configuration"}
                  </h3>
                  <p className="mb-4">
                    {language === "es"
                      ? "Cada dispositivo en NetSimLab puede ser configurado con diferentes parámetros según su tipo. Para configurar un dispositivo, selecciónelo haciendo clic en él y utilice el panel de configuración a la derecha."
                      : "Each device in NetSimLab can be configured with different parameters according to its type. To configure a device, select it by clicking on it and use the configuration panel on the right."}
                  </p>

                  <h4 className="font-medium text-md mt-6 mb-2">
                    {language === "es" ? "Configuración Básica" : "Basic Configuration"}
                  </h4>
                  <p className="mb-4">
                    {language === "es"
                      ? "Todos los dispositivos tienen una configuración básica que incluye:"
                      : "All devices have a basic configuration that includes:"}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>
                      <strong>{language === "es" ? "Nombre del Dispositivo" : "Device Name"}</strong>:{" "}
                      {language === "es"
                        ? "Identificador único para el dispositivo."
                        : "Unique identifier for the device."}
                    </li>
                    <li>
                      <strong>Hostname</strong>:{" "}
                      {language === "es"
                        ? "Nombre de host utilizado en comandos y protocolos de red."
                        : "Host name used in commands and network protocols."}
                    </li>
                    <li>
                      <strong>{language === "es" ? "Estado" : "Status"}</strong>:{" "}
                      {language === "es"
                        ? "Encendido o apagado. Los dispositivos deben estar encendidos para funcionar en la simulación."
                        : "On or off. Devices must be turned on to function in the simulation."}
                    </li>
                  </ul>

                  <h4 className="font-medium text-md mt-6 mb-2">
                    {language === "es" ? "Configuración de Interfaces" : "Interface Configuration"}
                  </h4>
                  <p className="mb-4">
                    {language === "es"
                      ? "Las interfaces de red pueden configurarse con los siguientes parámetros:"
                      : "Network interfaces can be configured with the following parameters:"}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>
                      <strong>{language === "es" ? "Dirección IP" : "IP Address"}</strong>:{" "}
                      {language === "es"
                        ? "Dirección IPv4 asignada a la interfaz (ej. 192.168.1.1)."
                        : "IPv4 address assigned to the interface (e.g., 192.168.1.1)."}
                    </li>
                    <li>
                      <strong>{language === "es" ? "Máscara de Subred" : "Subnet Mask"}</strong>:{" "}
                      {language === "es"
                        ? "Máscara que define la red (ej. 255.255.255.0)."
                        : "Mask that defines the network (e.g., 255.255.255.0)."}
                    </li>
                    <li>
                      <strong>{language === "es" ? "Estado" : "Status"}</strong>:{" "}
                      {language === "es"
                        ? "Activo o inactivo. Las interfaces deben estar activas para transmitir datos."
                        : "Up or down. Interfaces must be up to transmit data."}
                    </li>
                  </ul>

                  <h4 className="font-medium text-md mt-6 mb-2">
                    {language === "es" ? "Configuración Avanzada" : "Advanced Configuration"}
                  </h4>
                  <p className="mb-2">
                    {language === "es"
                      ? "Cada tipo de dispositivo tiene opciones de configuración específicas:"
                      : "Each device type has specific configuration options:"}
                  </p>

                  <div className="space-y-4 mb-6">
                    <div className="border rounded-md p-3">
                      <h5 className="font-medium mb-2">{language === "es" ? "Router" : "Router"}</h5>
                      <ul className="list-disc pl-6 text-sm">
                        <li>
                          <strong>{language === "es" ? "Tabla de Enrutamiento" : "Routing Table"}</strong>:{" "}
                          {language === "es"
                            ? "Añadir rutas estáticas con red, máscara, gateway e interfaz."
                            : "Add static routes with network, mask, gateway, and interface."}
                        </li>
                      </ul>
                    </div>

                    <div className="border rounded-md p-3">
                      <h5 className="font-medium mb-2">{language === "es" ? "PC y Servidor" : "PC and Server"}</h5>
                      <ul className="list-disc pl-6 text-sm">
                        <li>
                          <strong>{language === "es" ? "Gateway Predeterminado" : "Default Gateway"}</strong>:{" "}
                          {language === "es"
                            ? "Dirección IP del router para acceder a otras redes."
                            : "IP address of the router to access other networks."}
                        </li>
                        <li>
                          <strong>{language === "es" ? "Servidor DNS" : "DNS Server"}</strong>:{" "}
                          {language === "es"
                            ? "Dirección IP del servidor DNS para resolución de nombres."
                            : "IP address of the DNS server for name resolution."}
                        </li>
                      </ul>
                    </div>

                    <div className="border rounded-md p-3">
                      <h5 className="font-medium mb-2">{language === "es" ? "Servidor" : "Server"}</h5>
                      <ul className="list-disc pl-6 text-sm">
                        <li>
                          <strong>{language === "es" ? "Servicios" : "Services"}</strong>:{" "}
                          {language === "es"
                            ? "Habilitar/deshabilitar servicios como DHCP, DNS, HTTP, FTP."
                            : "Enable/disable services like DHCP, DNS, HTTP, FTP."}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
                    <h4 className="font-medium text-md mb-2 flex items-center">
                      <Info className="w-4 h-4 mr-2 text-blue-600" />
                      {language === "es" ? "Consejo" : "Tip"}
                    </h4>
                    <p>
                      {language === "es"
                        ? "Recuerde guardar los cambios de configuración haciendo clic en el botón 'Guardar' después de realizar modificaciones."
                        : "Remember to save configuration changes by clicking the 'Save' button after making modifications."}
                    </p>
                  </div>
                </TabsContent>

                {/* Simulation */}
                <TabsContent value="simulation" className="mt-0">
                  <h3 className="text-lg font-semibold mb-4">
                    {language === "es" ? "Simulación de Red" : "Network Simulation"}
                  </h3>
                  <p className="mb-4">
                    {language === "es"
                      ? "NetSimLab permite simular el funcionamiento de su red para probar la conectividad y el comportamiento de los dispositivos."
                      : "NetSimLab allows you to simulate the operation of your network to test connectivity and device behavior."}
                  </p>

                  <h4 className="font-medium text-md mt-6 mb-2">
                    {language === "es" ? "Modos de Simulación" : "Simulation Modes"}
                  </h4>
                  <div className="space-y-4 mb-6">
                    <div className="border rounded-md p-3">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <Settings className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <h5 className="font-medium">{language === "es" ? "Modo de Diseño" : "Design Mode"}</h5>
                          <p className="text-sm text-gray-600">
                            {language === "es"
                              ? "Permite añadir, mover y configurar dispositivos y conexiones."
                              : "Allows adding, moving, and configuring devices and connections."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-md p-3">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <Zap className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <h5 className="font-medium">
                            {language === "es" ? "Modo de Simulación" : "Simulation Mode"}
                          </h5>
                          <p className="text-sm text-gray-600">
                            {language === "es"
                              ? "Ejecuta la simulación de red para probar la conectividad y el comportamiento."
                              : "Runs the network simulation to test connectivity and behavior."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h4 className="font-medium text-md mt-6 mb-2">
                    {language === "es" ? "Controles de Simulación" : "Simulation Controls"}
                  </h4>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>
                      <strong>{language === "es" ? "Iniciar Simulación" : "Start Simulation"}</strong>:{" "}
                      {language === "es"
                        ? "Cambia del modo de diseño al modo de simulación y enciende todos los dispositivos."
                        : "Switches from design mode to simulation mode and turns on all devices."}
                    </li>
                    <li>
                      <strong>{language === "es" ? "Pausar" : "Pause"}</strong>:{" "}
                      {language === "es" ? "Pausa la simulación temporalmente." : "Temporarily pauses the simulation."}
                    </li>
                    <li>
                      <strong>{language === "es" ? "Detener" : "Stop"}</strong>:{" "}
                      {language === "es"
                        ? "Detiene la simulación y vuelve al modo de diseño."
                        : "Stops the simulation and returns to design mode."}
                    </li>
                  </ul>

                  <h4 className="font-medium text-md mt-6 mb-2">
                    {language === "es" ? "Herramientas de Análisis" : "Analysis Tools"}
                  </h4>
                  <div className="space-y-4 mb-6">
                    <div className="border rounded-md p-3">
                      <div className="flex items-center mb-2">
                        <Terminal className="w-5 h-5 mr-2 text-gray-700" />
                        <h5 className="font-medium">{language === "es" ? "Consola" : "Console"}</h5>
                      </div>
                      <p className="text-sm mb-2">
                        {language === "es"
                          ? "Permite ejecutar comandos en los dispositivos seleccionados para probar la conectividad y ver la configuración."
                          : "Allows running commands on selected devices to test connectivity and view configuration."}
                      </p>
                      <p className="text-sm text-gray-600">
                        {language === "es"
                          ? "Acceso: Botón 'Mostrar Consola' en la parte inferior derecha."
                          : "Access: 'Show Console' button at the bottom right."}
                      </p>
                    </div>

                    <div className="border rounded-md p-3">
                      <div className="flex items-center mb-2">
                        <Box className="w-5 h-5 mr-2 text-gray-700" />
                        <h5 className="font-medium">
                          {language === "es" ? "Inspector de Paquetes" : "Packet Inspector"}
                        </h5>
                      </div>
                      <p className="text-sm mb-2">
                        {language === "es"
                          ? "Muestra los paquetes que circulan por la red durante la simulación."
                          : "Shows packets flowing through the network during simulation."}
                      </p>
                      <p className="text-sm text-gray-600">
                        {language === "es"
                          ? "Acceso: Pestaña 'Paquetes' en el panel derecho."
                          : "Access: 'Packets' tab in the right panel."}
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-4">
                    <h4 className="font-medium text-md mb-2 flex items-center">
                      <Info className="w-4 h-4 mr-2 text-yellow-600" />
                      {language === "es" ? "Importante" : "Important"}
                    </h4>
                    <p>
                      {language === "es"
                        ? "Para que la simulación funcione correctamente, asegúrese de que los dispositivos estén correctamente configurados con direcciones IP válidas y que las interfaces estén activas."
                        : "For the simulation to work correctly, make sure devices are properly configured with valid IP addresses and that interfaces are up."}
                    </p>
                  </div>
                </TabsContent>

                {/* Commands */}
                <TabsContent value="commands" className="mt-0">
                  <h3 className="text-lg font-semibold mb-4">
                    {language === "es" ? "Comandos de Consola" : "Console Commands"}
                  </h3>
                  <p className="mb-4">
                    {language === "es"
                      ? "La consola de NetSimLab permite ejecutar comandos para interactuar con los dispositivos y probar la conectividad de la red."
                      : "The NetSimLab console allows you to run commands to interact with devices and test network connectivity."}
                  </p>

                  <h4 className="font-medium text-md mt-6 mb-2">
                    {language === "es" ? "Comandos Básicos" : "Basic Commands"}
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-2 text-left">{language === "es" ? "Comando" : "Command"}</th>
                          <th className="border p-2 text-left">{language === "es" ? "Descripción" : "Description"}</th>
                          <th className="border p-2 text-left">{language === "es" ? "Ejemplo" : "Example"}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border p-2 font-mono">ping &lt;ip&gt;</td>
                          <td className="border p-2">
                            {language === "es"
                              ? "Envía paquetes ICMP a una dirección IP para probar la conectividad."
                              : "Sends ICMP packets to an IP address to test connectivity."}
                          </td>
                          <td className="border p-2 font-mono">ping 192.168.1.1</td>
                        </tr>
                        <tr>
                          <td className="border p-2 font-mono">show interfaces</td>
                          <td className="border p-2">
                            {language === "es"
                              ? "Muestra información sobre las interfaces del dispositivo."
                              : "Shows information about the device's interfaces."}
                          </td>
                          <td className="border p-2 font-mono">show interfaces</td>
                        </tr>
                        <tr>
                          <td className="border p-2 font-mono">ifconfig</td>
                          <td className="border p-2">
                            {language === "es"
                              ? "Alternativa a 'show interfaces' para dispositivos tipo PC."
                              : "Alternative to 'show interfaces' for PC-type devices."}
                          </td>
                          <td className="border p-2 font-mono">ifconfig</td>
                        </tr>
                        <tr>
                          <td className="border p-2 font-mono">show ip route</td>
                          <td className="border p-2">
                            {language === "es"
                              ? "Muestra la tabla de enrutamiento (solo en routers)."
                              : "Shows the routing table (routers only)."}
                          </td>
                          <td className="border p-2 font-mono">show ip route</td>
                        </tr>
                        <tr>
                          <td className="border p-2 font-mono">route</td>
                          <td className="border p-2">
                            {language === "es"
                              ? "Alternativa a 'show ip route' para dispositivos tipo PC."
                              : "Alternative to 'show ip route' for PC-type devices."}
                          </td>
                          <td className="border p-2 font-mono">route</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h4 className="font-medium text-md mt-6 mb-2">
                    {language === "es" ? "Uso de la Consola" : "Using the Console"}
                  </h4>
                  <ol className="list-decimal pl-6 space-y-2 mb-4">
                    <li>
                      {language === "es"
                        ? "Seleccione un dispositivo haciendo clic en él."
                        : "Select a device by clicking on it."}
                    </li>
                    <li>
                      {language === "es"
                        ? "Haga clic en el botón 'Mostrar Consola' en la parte inferior derecha."
                        : "Click the 'Show Console' button at the bottom right."}
                    </li>
                    <li>
                      {language === "es"
                        ? "Escriba un comando y presione Enter para ejecutarlo."
                        : "Type a command and press Enter to execute it."}
                    </li>
                    <li>
                      {language === "es"
                        ? "Los resultados se mostrarán en la consola."
                        : "Results will be displayed in the console."}
                    </li>
                  </ol>

                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
                    <h4 className="font-medium text-md mb-2 flex items-center">
                      <Info className="w-4 h-4 mr-2 text-blue-600" />
                      {language === "es" ? "Consejo" : "Tip"}
                    </h4>
                    <p>
                      {language === "es"
                        ? "Puede usar las teclas de flecha arriba y abajo para navegar por el historial de comandos."
                        : "You can use the up and down arrow keys to navigate through command history."}
                    </p>
                  </div>
                </TabsContent>
              </div>
            </ScrollArea>

            {/* Flechas de navegación */}
            <div className="absolute right-4 bottom-20 flex flex-col gap-2">
              <button
                onClick={() => {
                  const scrollContainer = document
                    .getElementById("docs-scroll-area")
                    ?.querySelector("[data-radix-scroll-area-viewport]")
                  if (scrollContainer) {
                    scrollContainer.scrollBy({ top: -200, behavior: "smooth" })
                  }
                }}
                className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 shadow-md"
                aria-label={language === "es" ? "Desplazar hacia arriba" : "Scroll up"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m18 15-6-6-6 6" />
                </svg>
              </button>
              <button
                onClick={() => {
                  const scrollContainer = document
                    .getElementById("docs-scroll-area")
                    ?.querySelector("[data-radix-scroll-area-viewport]")
                  if (scrollContainer) {
                    scrollContainer.scrollBy({ top: 200, behavior: "smooth" })
                  }
                }}
                className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 shadow-md"
                aria-label={language === "es" ? "Desplazar hacia abajo" : "Scroll down"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
          </div>
        </Tabs>

        <div className="flex justify-end p-4 border-t">
          <Button onClick={onClose}>{t.close}</Button>
        </div>
      </div>
    </div>
  )
}
