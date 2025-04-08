"use client"

import type React from "react"
import type { Connection, SimulationMode } from "@/lib/types"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ConnectionLineProps {
  connection: Connection
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  isSelected: boolean
  simulationMode: SimulationMode
  onDelete: () => void
}

export function ConnectionLine({
  connection,
  sourceX,
  sourceY,
  targetX,
  targetY,
  isSelected,
  simulationMode,
  onDelete,
}: ConnectionLineProps) {
  // Calculate the center points of the devices
  const x1 = sourceX + 25
  const y1 = sourceY + 25
  const x2 = targetX + 25
  const y2 = targetY + 25

  // Calculate the length of the line
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

  // Calculate the angle of the line
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI)

  // Calculate the midpoint for the delete button
  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete()
  }

  // Get color based on cable type
  const getCableColor = () => {
    switch (connection.type) {
      case "ethernet":
        return "bg-blue-500"
      case "crossover":
        return "bg-orange-500"
      case "serial":
        return "bg-green-500"
      case "fiber":
        return "bg-purple-500"
      case "console":
        return "bg-gray-500"
      default:
        return "bg-blue-500"
    }
  }

  // Get thickness based on bandwidth
  const getThickness = () => {
    if (isSelected) return "h-2"

    if (connection.bandwidth >= 1000) return "h-1.5"
    if (connection.bandwidth >= 100) return "h-1"
    return "h-0.5"
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`absolute ${getCableColor()} ${getThickness()} ${
              connection.status === "down" ? "opacity-50" : ""
            }`}
            style={{
              left: x1,
              top: y1,
              width: length,
              transformOrigin: "left center",
              transform: `rotate(${angle}deg)`,
              zIndex: isSelected ? 5 : 1,
            }}
          />
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <div>Tipo: {connection.type}</div>
            <div>Velocidad: {connection.bandwidth} Mbps</div>
            <div>Estado: {connection.status === "up" ? "Activo" : "Inactivo"}</div>
          </div>
        </TooltipContent>
      </Tooltip>

      {/* Delete button - only visible when selected and in design mode */}
      {isSelected && simulationMode === "design" && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute w-5 h-5 transform -translate-x-1/2 -translate-y-1/2 z-20"
          style={{
            left: midX,
            top: midY,
          }}
          onClick={handleDelete}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      )}
    </TooltipProvider>
  )
}
