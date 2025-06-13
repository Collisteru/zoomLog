// editEvent.js

// TODO: Make this different in all the importnat ways from addModal
import React, { useState } from "react";
import axios from "axios";
import "./EventModal.css";
import { handleSummarize } from "./summarize.js";

export default function EditEventModal({ isOpen, onClose, onSubmit, event }) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [transcript, setTranscript] = useState("");

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
        <h1>Edit Event:</h1>
        <div>Title:</div>
        <textarea
          className="event-input"
          placeholder={event.title}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={2}
        />
        <div>Transcript:</div>
        <textarea
          className="event-input"
          placeholder="Event transcript"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          rows={6}
        />
        <div>Description:</div>
        <textarea
          className="event-input"
          placeholder={event.notes}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />

        <div>Next Steps:</div>
        <textarea
          className="event-input"
          placeholder={event.next_steps}
          value={nextSteps}
          onChange={(e) => setNextSteps(e.target.value)}
          rows={4}
        />

        <div className="modal-buttons">
          <button onClick={handleSubmit}>Update</button>
          <button onClick={onDelete}>Delete</button>
          <button
            onClick={async () => {
              const { summary, nextSteps } = await handleSummarize(transcript);
              console.log("Back in client.");
              console.log(summary);
              console.log(nextSteps);
              setDescription(summary);
              setNextSteps(nextSteps);
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
