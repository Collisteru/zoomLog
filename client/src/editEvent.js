// editEvent.js

// TODO: Make this different in all the importnat ways from addModal
import React, { useState } from "react";
import axios from "axios";
import "./EventModal.css";

export default function EditEventModal({ isOpen, onClose, onSubmit, event }) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [nextSteps, setNextSteps] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title & !time & !description & !nextSteps) return;
    onSubmit({ title, start: time, description, nextSteps });
    setTitle("");
    setDescription("");
    setNextSteps("");
    onClose();
  };

  const onDelete = async () => {
    console.log("Hi from the client. Delete request.");
    await axios.delete(`http://localhost:5000/api/events/delete`, {
      data: { id: event.id },
    });
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
        <h1>Edit Event: {event.title}</h1>
        <div>
          <div>Title:</div>
          <input
            type="text"
            placeholder={event.title}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <div>Time:</div>
          <input
            type="text"
            placeholder={event.startTime}
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div>
          <div>Description:</div>
          <input
            type="text"
            placeholder={event.notes}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <div>Next Steps:</div>
          <input
            type="text"
            placeholder={event.next_steps}
            value={nextSteps}
            onChange={(e) => setNextSteps(e.target.value)}
          />
        </div>
        <div className="modal-buttons">
          <button onClick={handleSubmit}>Update</button>
          <button onClick={onDelete}>Delete</button>
          <button onClick={clearFields}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
