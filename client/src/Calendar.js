import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import AddEventModal from "./addEvent";
import EditEventModal from "./editEvent";
import EventBlock from "./EventBlock.js";

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
  // Calendar element State management
  const [newEventSlot, setNewEventSlot] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [events, setEvents] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));
  const [eventToEdit, setEventToEdit] = useState(null);

  // Upon each render, populate the calendar with events from the server
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };
    fetchEvents();
  }, [weekStart, modalOpen, editModalOpen]);

  // When the app starts, ping Zoom API to verify connection
  useEffect(() => {
    const pingZoomAPI = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/zoom/ping");
        console.log("Ping response:", res.data);
      } catch (error) {
        console.error("Error pinging Zoom API:", error);
      }
    };
    pingZoomAPI();
  }, []);

  const handleEventUpdate = async (updatedEvent) => {
    console.log("Updated event data:", updatedEvent);
    console.log("Event to edit:", eventToEdit);

    const title = updatedEvent.title || eventToEdit.title;
    const startTime = updatedEvent.startTime || eventToEdit.startTime;
    const endTime = updatedEvent.startTime || startTime;
    const notes = updatedEvent.description || eventToEdit.notes;
    const next_steps = updatedEvent.nextSteps || eventToEdit.next_steps;
    const id = eventToEdit.id;

    // console.log("Stuff:", id, title, startTime, endTime, notes, next_steps);

    // console.log("Hi from the client.");
    await axios.put(`http://localhost:5000/api/events/update`, {
      id,
      title,
      startTime,
      endTime,
      notes,
      next_steps,
    });

    setEditModalOpen(false);
  };

  const handleSlotClick = (day, hour) => {
    // console.log("Clicked slot:", day, hour);
    const start = new Date(day);
    start.setHours(hour, 0, 0, 0);
    setNewEventSlot(start);
    setSelectedSlot(start);
    setModalOpen(true);
    // submitEvent(start);
  };

  const handleEventBlockClick = (event) => {
    setEventToEdit(event);
    setEditModalOpen(true);
  };

  const handleModalSubmit = async ({
    title,
    start,
    end,
    description,
    nextSteps,
    date,
  }) => {
    try {
      if (!description) description = "None.";
      if (!nextSteps) nextSteps = "None.";

      function combineDateWithTime(timeStr) {
        // Get current date in yyyy-mm-dd format
        const desiredDate = new Date(date);
        console.log("Desired date:", desiredDate);
        const year = desiredDate.getFullYear();
        const month = String(desiredDate.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
        const day = String(desiredDate.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;

        // Combine and parse as Date
        const dateTimeStr = `${dateStr} ${timeStr}`;
        return new Date(dateTimeStr); // Parsed in local time zone
      }

      const startDate = combineDateWithTime(start);
      const endDate = combineDateWithTime(end);

      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          startTime: startDate,
          endTime: endDate,
          notes: description,
          next_steps: nextSteps,
        }),
      });
      console.log("Yet another.");

      const result = await res.json();
      console.log("Event saved:", result);
      setNewEventSlot(null);
      // Optionally close modal or refresh events here
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const prevWeek = () => setWeekStart(addDays(weekStart, -7));
  const nextWeek = () => setWeekStart(addDays(weekStart, 7));

  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(addDays(weekStart, i));
  }

  const hours = generateHours();

  return (
    <div className="Calendar-container">
      <AddEventModal
        isOpen={modalOpen}
        slotTime={selectedSlot}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <EditEventModal
        isOpen={editModalOpen}
        event={eventToEdit}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEventUpdate}
      />

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
                      textAlign: "left",
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
              {events
                .filter(
                  (e) =>
                    new Date(e.startTime).toDateString() === day.toDateString()
                )
                .map((event) => (
                  <EventBlock
                    key={event.id}
                    event={event}
                    onClick={() => handleEventBlockClick(event)}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
