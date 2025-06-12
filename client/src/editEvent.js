// editEvent.js

// TODO: Make this different in all the importnat ways from addModal
import React, { useState } from "react";
import "./EventModal.css";

export default function AddEventModal({ isOpen, onClose, onSubmit, slotTime }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [nextSteps, setNextSteps] = useState("");

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
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>New Event</h2>
        <p>{slotTime.toLocaleString()}</p>
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
