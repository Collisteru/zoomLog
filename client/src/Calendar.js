import React, { useState } from "react";
// import axios from "axios";
import "./App.css";

// Setting up calendar with proper date handling

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
  // Clickable hours

  const [newEventSlot, setNewEventSlot] = useState(null);
  const [eventTitle, setEventTitle] = useState("");

  const handleSlotClick = (day, hour) => {
    // console.log("Clicked slot:", day, hour);
    const start = new Date(day);
    start.setHours(hour, 0, 0, 0);
    setNewEventSlot(start);
    submitEvent(start);
  };

  const submitEvent = async (start) => {
    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    const res = await fetch("http://localhost:5000/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: eventTitle,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        notes: "Test notes",
        next_steps: "Test next steps",
      }),
    });

    const result = await res.json();
    setNewEventSlot(null);
    setEventTitle("Test Event");
    console.log("Event created:", result);
  };

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
              {hours.map((hourLabel, i) => (
                <div key={i} className="calendar-hour-slot">
                  <button
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      background: "transparent",
                      textAlign: "center",
                      cursor: "pointer",
                      paddingLeft: "4px",
                    }}
                    onClick={() => handleSlotClick(day, i)}
                    aria-label={`Create event at ${hourLabel} on ${formatDate(
                      day
                    )}`}
                  >
                    {hourLabel}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
