"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface DateRangeFilterProps {
  value: [string, string]
  onChange: (value: [string, string]) => void
  isActive: boolean
  onClear: () => void
}

export function DateRangeFilter({ value, onChange, isActive, onClear }: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState<string>(value[0])
  const [endDate, setEndDate] = useState<string>(value[1])

  useEffect(() => {
    setStartDate(value[0])
    setEndDate(value[1])
  }, [value])

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value)
    onChange([e.target.value, endDate])
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value)
    onChange([startDate, e.target.value])
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Période de Donation</Label>
        {isActive && (
          <Button variant="ghost" size="sm" onClick={onClear} className="h-6 px-2">
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Label htmlFor="start-date" className="text-xs">
            Du
          </Label>
          <Input id="start-date" type="date" value={startDate} onChange={handleStartDateChange} className="h-8" />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="end-date" className="text-xs">
            Au
          </Label>
          <Input id="end-date" type="date" value={endDate} onChange={handleEndDateChange} className="h-8" />
        </div>
      </div>
    </div>
  )
}
