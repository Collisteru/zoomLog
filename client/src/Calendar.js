import React, { useState } from "react";
import "./App.css";

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "numeric",
    day: "numeric",
  });
}

function generateHours() {
  const hours = [];
  for (let h = 0; h < 24; h++) {
    const hourLabel = new Date();
    hourLabel.setHours(h, 0, 0, 0);
    hours.push(
      hourLabel.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  }
  return hours;
}

export default function WeeklyCalendar() {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));

  const prevWeek = () => setWeekStart(addDays(weekStart, -7));
  const nextWeek = () => setWeekStart(addDays(weekStart, 7));

  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(addDays(weekStart, i));
  }

  const hours = generateHours();

  return (
    <div className="Calendar-container">
      <header>
        <button onClick={prevWeek}>&lt;</button>
        <span style={{ margin: "0 1rem", fontWeight: "bold" }}>
          Week of {weekStart.toLocaleDateString()}
        </span>
        <button onClick={nextWeek}>&gt;</button>
      </header>

      <div className="calendar-grid">
        {days.map((day) => (
          <div key={day.toISOString()} className="calendar-day">
            <div className="calendar-day-header">{formatDate(day)}</div>
            <div className="calendar-day-body">
              {hours.map((hour, i) => (
                <div key={i} className="calendar-hour-slot">
                  {hour}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
