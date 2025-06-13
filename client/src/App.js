// client/src/App.js

import "./App.css";
import "./Calendar.js";
import "./Notes.js";
import "./getEvents.js";
import WeeklyCalendar from "./Calendar.js";
import { GetEventsButton } from "./getEvents.js";
import { FetchRecordingsButton } from "./fetchRecordings.js";

function App() {
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
          <FetchRecordingsButton />
          {/* <GetEventsButton /> */}
          <WeeklyCalendar />
        </main>
      </div>
    </>
  );
}

export default App;
