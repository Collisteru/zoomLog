// AddEventModal.js
import React, { useState } from "react";
import "./EventModal.css";
import { handleSummarize } from "./summarize.js";

export default function AddEventModal({ isOpen, onClose, onSubmit, slotTime }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [transcript, setTranscript] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title) return;
    if (!startTime) startTime = slotTime.toLocaleTimeString();
    if (!endTime) {
      var slotTimeCopy = new Date(slotTime);
      endTime = slotTimeCopy.setHours(slotTimeCopy.getHours() + 1);
      endTime = new Date(endTime).toLocaleTimeString();
    }
    onSubmit({ title, start: startTime, end: endTime, description, nextSteps });
    setTitle("");
    setDescription("");
    setNextSteps("");
    setTranscript("");
    setStartTime("");
    setEndTime("");
    onClose();
  };

  const clearFields = () => {
    setTitle("");
    setDescription("");
    setNextSteps("");
    setTranscript("");
    setStartTime("");
    setEndTime("");
    onClose();
  };
  // console.log("Slot time in AddEventModal:", slotTime);
  var defaultStartTime = slotTime.toLocaleTimeString();
  var slotTimeCopy = new Date(slotTime);
  var defaultEndTime = slotTimeCopy.setHours(slotTimeCopy.getHours() + 1);
  defaultEndTime = new Date(defaultEndTime).toLocaleTimeString();

  return (
    <div className="modal-backdrop">
      <title>New Event</title>
      <div className="modal">
        <h2>New Event</h2>
        <input
          type="text"
          className="event-input"
          placeholder={defaultStartTime}
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />

        <input
          type="text"
          className="event-input"
          placeholder={defaultEndTime}
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
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
              const { summary, nextSteps } = await handleSummarize(transcript);
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
