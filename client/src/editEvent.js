// editEvent.js

// TODO: Make this different in all the importnat ways from addModal
import React, { useState } from "react";
import "./EventModal.css";

export default function EditEventModal({ isOpen, onClose, onSubmit, event }) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [nextSteps, setNextSteps] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title) return;
    onSubmit({ title, start: time, description, nextSteps });
    setTitle("");
    setDescription("");
    setNextSteps("");
    onClose();
  };

  const clearFields = () => {
    setTitle("");
    setDescription("");
    setNextSteps("");
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <title>Edit Event</title>

        <input
          type="text"
          placeholder="Event Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Next Steps"
          value={nextSteps}
          onChange={(e) => setNextSteps(e.target.value)}
        />
        <div className="modal-buttons">
          <button onClick={handleSubmit}>Add</button>
          <button onClick={clearFields}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
