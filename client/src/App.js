// client/src/App.js
import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", body: "" });

  useEffect(() => {
    axios.get("/api/notes").then((res) => setNotes(res.data));
  }, []);

  const addNote = () => {
    axios.post("/api/notes", newNote).then((res) => {
      setNotes([...notes, res.data]);
      setNewNote({ title: "", body: "" });
    });
  };

  return (
    <>
      <div className="app-container">
        <header className="App-header">
          <h1 className="App-title">ZoomLog</h1>
          <a href="/" className="Header-link">
            Home
          </a>
        </header>

        <main className="App-main">
          <h1>Welcome to the App</h1>

          <span>Notes</span>
          <div>
            <div>Title:</div>
            <input
              value={newNote.title}
              onChange={(e) =>
                setNewNote({ ...newNote, title: e.target.value })
              }
            />
          </div>

          <div>
            <div>Body:</div>
            <textarea
              value={newNote.body}
              onChange={(e) => setNewNote({ ...newNote, body: e.target.value })}
            />
          </div>

          <button onClick={addNote}>Add Note</button>

          <ul>
            {[...notes]
              .reverse()
              .filter((n) => n.title?.trim() || n.body?.trim()) // keep only nonempty notes
              .map((n) => (
                <li key={n.id}>
                  <strong>{n.title}</strong>: {n.body}
                </li>
              ))}
          </ul>
        </main>
      </div>
    </>
  );
}

export default App;
