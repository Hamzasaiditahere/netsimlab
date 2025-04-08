"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Device, LogEntry } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Terminal } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ConsolePanelProps {
  selectedDevice: Device | null
  logs: LogEntry[]
  onExecuteCommand: (deviceId: string, command: string) => void
  onClose: () => void
}

export function ConsolePanel({ selectedDevice, logs, onExecuteCommand, onClose }: ConsolePanelProps) {
  const [command, setCommand] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when logs change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [logs])

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!command.trim() || !selectedDevice) return

    onExecuteCommand(selectedDevice.id, command)

    // Add to history
    setCommandHistory((prev) => [...prev, command])
    setHistoryIndex(-1)

    // Clear input
    setCommand("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle up/down arrows for command history
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setCommand(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCommand(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCommand("")
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 border-b border-gray-700">
        <div className="flex items-center">
          <Terminal className="w-4 h-4 mr-2 text-gray-400" />
          <span className="text-sm font-medium">{selectedDevice ? `Consola: ${selectedDevice.name}` : "Consola"}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-2" ref={scrollAreaRef}>
          {logs.map((log) => (
            <div key={log.id} className="mb-1">
              <span className="text-xs text-gray-500 mr-2">{log.timestamp.toLocaleTimeString()}</span>
              <span
                className={`text-sm ${
                  log.type === "error"
                    ? "text-red-400"
                    : log.type === "command"
                      ? "text-yellow-400"
                      : log.type === "info"
                        ? "text-blue-400"
                        : "text-green-400"
                }`}
              >
                {log.message}
              </span>
            </div>
          ))}
        </ScrollArea>
      </div>

      <form onSubmit={handleCommandSubmit} className="p-2 border-t border-gray-700">
        <div className="flex items-center">
          <span className="text-green-400 mr-2">{selectedDevice ? `${selectedDevice.name}#` : ">"}</span>
          <Input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none text-white focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder={selectedDevice ? "Escriba un comando..." : "Seleccione un dispositivo..."}
            disabled={!selectedDevice}
          />
        </div>
      </form>
    </div>
  )
}
