"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "A+", value: 35 },
  { name: "A-", value: 6 },
  { name: "B+", value: 20 },
  { name: "B-", value: 4 },
  { name: "AB+", value: 8 },
  { name: "AB-", value: 2 },
  { name: "O+", value: 20 },
  { name: "O-", value: 5 },
]

const COLORS = ["#ef4444", "#f87171", "#fca5a5", "#fecaca", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d"]

export default function BloodTypeDistribution() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `${value}%`}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

