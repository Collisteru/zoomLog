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
app.use(express.static(path.join(__dirname, "../client/build")));

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

// Get all meetings
app.get("/api/events", async (req, res) => {
  const events = await prisma.event.findMany();
  res.json(events);
});

// Catch-all route
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
