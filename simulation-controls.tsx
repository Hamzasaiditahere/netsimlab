"use client"

import type { SimulationMode } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Zap } from "lucide-react"

interface SimulationControlsProps {
  mode: SimulationMode
  isSimulating: boolean
  onStartSimulation: () => void
  onStopSimulation: () => void
  onResetSimulation: () => void
}

export function SimulationControls({
  mode,
  isSimulating,
  onStartSimulation,
  onStopSimulation,
  onResetSimulation,
}: SimulationControlsProps) {
  return (
    <div className="flex items-center space-x-2">
      {mode === "design" ? (
        <Button variant="default" className="gap-2" onClick={onStartSimulation}>
          <Zap className="w-4 h-4" />
          Iniciar Simulación
        </Button>
      ) : (
        <>
          {isSimulating ? (
            <Button variant="outline" size="sm" className="gap-1" onClick={onStopSimulation}>
              <Pause className="w-4 h-4" />
              Pausar
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="gap-1" onClick={onStartSimulation}>
              <Play className="w-4 h-4" />
              Reanudar
            </Button>
          )}

          <Button variant="outline" size="sm" className="gap-1" onClick={onResetSimulation}>
            <RotateCcw className="w-4 h-4" />
            Detener
          </Button>
        </>
      )}
    </div>
  )
}
