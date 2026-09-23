"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface DayPoint {
  date: string;
  views: number;
  whatsapp: number;
  aiQueries: number;
}

export function ActivityChart({ data }: { data: DayPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#00000040" />
        <YAxis tick={{ fontSize: 11 }} stroke="#00000040" allowDecimals={false} />
        <Tooltip />
        <Line type="monotone" dataKey="views" name="Vistas" stroke="#6c5ce7" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="whatsapp" name="WhatsApp" stroke="#25D366" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="aiQueries" name="Consultas IA" stroke="#0ea5e9" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function TopProductsChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#00000010" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11 }} stroke="#00000040" allowDecimals={false} />
        <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} stroke="#00000040" />
        <Tooltip />
        <Bar dataKey="value" fill="#6c5ce7" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
