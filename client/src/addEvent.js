// AddEventModal.js
import React, { useState } from "react";
import "./EventModal.css";

export default function AddEventModal({ isOpen, onClose, onSubmit, slotTime }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [transcript, setTranscript] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title) return;
    onSubmit({ title, start: slotTime, description, nextSteps });
    setTitle("");
    setDescription("");
    setNextSteps("");
    onClose();
  };

  const handleSummarize = async () => {
    if (!transcript) return;
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcription: transcript }),
      });
      const data = await response.json();
      if (response.ok) {
        setDescription(data.summary);
      } else {
        console.error("Error summarizing transcript:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const clearFields = () => {
    setTitle("");
    setDescription("");
    setNextSteps("");
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <title>New Event</title>
      <div className="modal">
        <h2>New Event</h2>
        <p>{slotTime.toLocaleString()}</p>
        <textarea
          className="event-input"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={2}
        />
        <textarea
          className="event-input"
          placeholder="Transcript"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          rows={6}
        />
        <textarea
          className="event-input"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />

        <textarea
          className="event-input"
          placeholder="Next Steps"
          value={nextSteps}
          onChange={(e) => setNextSteps(e.target.value)}
          rows={4}
        />

        <div className="modal-buttons">
          <button onClick={handleSubmit}>Add</button>
          <button onClick={handleSummarize}>Summarize</button>
          <button onClick={clearFields}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
