"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface DonationsCountFilterProps {
  value: [number, number]
  onChange: (value: [number, number]) => void
  isActive: boolean
  onClear: () => void
}

export function DonationsCountFilter({ value, onChange, isActive, onClear }: DonationsCountFilterProps) {
  const [range, setRange] = useState<[number, number]>(value)

  useEffect(() => {
    setRange(value)
  }, [value])

  const handleChange = (newValue: number[]) => {
    const newRange: [number, number] = [newValue[0], newValue[1]]
    setRange(newRange)
    onChange(newRange)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Nombre de Donations</Label>
        {isActive && (
          <Button variant="ghost" size="sm" onClick={onClear} className="h-6 px-2">
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <Slider defaultValue={[0, 20]} value={range} max={20} step={1} onValueChange={handleChange} className="my-6" />
      <div className="flex items-center justify-between">
        <span className="text-sm">{range[0]}</span>
        <span className="text-sm">{range[1]}</span>
      </div>
    </div>
  )
}
