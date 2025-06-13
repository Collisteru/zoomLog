// Imports
const express = require("express");
const cors = require("cors");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

// Prisma server
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // parse JSON body

// Calls from client

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

// Get all notes
app.get("/api/notes", async (req, res) => {
  const notes = await prisma.note.findMany();
  res.json(notes);
});

// Post a new note
app.post("/api/notes", async (req, res) => {
  const { title, body } = req.body;
  const note = await prisma.note.create({ data: { title, body } });
  res.status(201).json(note);
});

// Post a new meeting
app.post("/api/events", async (req, res) => {
  const { title, startTime, endTime, notes, next_steps } = req.body;
  const event = await prisma.event.create({
    data: {
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      notes,
      next_steps,
    },
  });
  res.json(event);
});

// Update a meeting
app.put("/api/events/update", async (req, res) => {
  console.log("Hi from the server.");
  const { id, title, startTime, endTime, notes, next_steps } = req.body;

  console.log("Updating event with id:", id);

  console.log(
    "Stuff in the server: ",
    id,
    title,
    startTime,
    endTime,
    notes,
    next_steps
  );

  try {
    // TODO: Update for proper handling of endTime
    const start = new Date(startTime);
    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        title,
        startTime: new Date(startTime),
        endTime: new Date(start.getTime() + 60 * 60 * 1000),
        notes,
        next_steps,
      },
    });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error.message);
  }
});

// Get all meetings
app.get("/api/events", async (req, res) => {
  const events = await prisma.event.findMany();
  res.json(events);
});

app.use(express.static(path.join(__dirname, "../client/build")));

// Log every

// Catch-all route (don't change to a single asterisk, it causes a regex parsing error)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
