// EventBlock.js
import React from "react";
import "./eventBlock.css";

export default function EventBlock({ event, onClick }) {
  const start = new Date(event.startTime);
  const end = new Date(event.endTime);

  const durationHours = (end - start) / (1000 * 60 * 60);
  const top = start.getHours() * 60 + start.getMinutes(); // minutes from top
  const height = durationHours * 60; // height in minutes

  return (
    <div
      className="event-block"
      style={{
        position: "absolute",
        top: `${top}px`,
        height: `${height * 0.5}px`,
        width: "10%",
        backgroundColor: "#4CAF50",
        color: "white",
        padding: "2px",
        boxSizing: "border-box",
        borderRadius: "4px",
        overflow: "hidden",
        cursor: "pointer",
        fontSize: "0.75rem",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(event);
      }}
    >
      {event.title}
    </div>
  );
}
