"use client"

import { useEffect, useRef } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "A+",
    units: 320,
    critical: 100,
  },
  {
    name: "A-",
    units: 120,
    critical: 100,
  },
  {
    name: "B+",
    units: 80,
    critical: 100,
  },
  {
    name: "B-",
    units: 110,
    critical: 100,
  },
  {
    name: "AB+",
    units: 180,
    critical: 100,
  },
  {
    name: "AB-",
    units: 60,
    critical: 100,
  },
  {
    name: "O+",
    units: 140,
    critical: 100,
  },
  {
    name: "O-",
    units: 80,
    critical: 100,
  },
]

export default function BloodStockChart() {
  const tooltipRef = useRef(null)

  useEffect(() => {
    // This is a workaround for a Recharts issue with tooltips in responsive containers
    const tooltipEl = document.querySelector(".recharts-tooltip-wrapper")
    if (tooltipEl && tooltipRef.current) {
      tooltipEl.setAttribute("style", "pointer-events: none;")
    }
  }, [])

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            ref={tooltipRef}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          />
          <Bar dataKey="units" fill="#ef4444" radius={[4, 4, 0, 0]} name="Unités" />
          <Bar dataKey="critical" fill="#f87171" radius={[4, 4, 0, 0]} name="Critique" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

