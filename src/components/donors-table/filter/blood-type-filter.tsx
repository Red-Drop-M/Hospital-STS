"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface BloodTypeFilterProps {
  value: string[]
  onChange: (value: string[]) => void
  isActive: boolean
  onClear: () => void
}

export function BloodTypeFilter({ value, onChange, isActive, onClear }: BloodTypeFilterProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(value)

  useEffect(() => {
    setSelectedTypes(value)
  }, [value])

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  const handleChange = (type: string, checked: boolean) => {
    const newSelection = checked ? [...selectedTypes, type] : selectedTypes.filter((t) => t !== type)

    setSelectedTypes(newSelection)
    onChange(newSelection)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Groupe Sanguin</Label>
        {isActive && (
          <Button variant="ghost" size="sm" onClick={onClear} className="h-6 px-2">
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {bloodTypes.map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <Checkbox
              id={`blood-type-${type}`}
              checked={selectedTypes.includes(type)}
              onCheckedChange={(checked) => handleChange(type, checked === true)}
            />
            <Label htmlFor={`blood-type-${type}`} className="text-sm">
              {type}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}
