# 🌐 Netsimlab – Simulador de Redes Web

**Netsimlab** es una aplicación web interactiva que permite simular redes informáticas de forma visual desde el navegador. Inspirado en Cisco Packet Tracer, está desarrollado en **React + TypeScript** y utiliza **SVG** para mostrar los dispositivos y conexiones de red.

Su objetivo es ofrecer una herramienta ligera y accesible para aprender y practicar conceptos básicos de redes sin necesidad de software pesado ni hardware real.

---

## 🚀 Características actuales

- 🖥️ Crear dispositivos como PCs, routers y switches.
- 🔌 Conectar dispositivos con cables de red virtuales.
- ⚙️ Configurar manualmente parámetros de red:
  - Dirección IP
  - Máscara de subred
  - Puerta de enlace (gateway)
- 📡 Validación básica de red: el sistema detecta si dos dispositivos pueden comunicarse según su configuración IP y conexión.
- 🧠 Interfaz visual SVG para arrastrar y ubicar elementos fácilmente.
- 💾 Guardado de topología como archivo JSON (para volver a cargarla más tarde).

---

## 📸 Vista previa

> *(Puedes agregar una imagen del simulador en uso cuando quieras aquí)*

---

## 🛠️ Tecnologías usadas

- **React** + **TypeScript**
- **SVG** para gráficos interactivos
- **TailwindCSS** para estilos
- **uuid** para identificadores únicos
- **React DnD** para movimiento de elementos

---

## ⚙️ Cómo usar en local

1. Clona el repositorio:

```bash
git clone https://github.com/Hamzasaiditahere/netsimlab.git
cd netsimlab
