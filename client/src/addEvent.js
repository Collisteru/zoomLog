// AddEventModal.js
import React, { useState } from "react";
import "./EventModal.css";
import { handleSummarize } from "./summarize.js";

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

  const clearFields = () => {
    setTitle("");
    setDescription("");
    setNextSteps("");
    setTranscript("");
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
          <button
            onClick={async () => {
              const summary = await handleSummarize(transcript);
              setDescription(summary);
            }}
          >
            Summarize
          </button>
          <button onClick={clearFields}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
