// Imports
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const { OpenAI } = require("openai");

// Import secrets
require("dotenv").config();
const ZOOM_SECRET = process.env.ZOOM_SECRET;

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

// Delete a meeting
app.delete("/api/events/delete", async (req, res) => {
  const { id } = req.body;
  try {
    const deletedEvent = await prisma.event.delete({
      where: { id: parseInt(id) },
    });
    res.json(deletedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all meetings
app.get("/api/events", async (req, res) => {
  const events = await prisma.event.findMany();
  res.json(events);
});

// --- Zoom Endpoint --- //

app.post("/zoom/webhook", express.json(), (req, res) => {
  console.log("ZOOM WEBHOOK VERIFICATION ACTIVATED!");

  // CRC Verification Endpoint
  if (req.body.event === "endpoint.url_validation") {
    console.log("It's a CRC");
    const hashForValidate = crypto
      .createHmac("sha256", ZOOM_SECRET)
      .update(req.body.payload.plainToken)
      .digest("hex");

    res.status(200);
    res.json({
      plainToken: req.body.payload.plainToken,
      encryptedToken: hashForValidate,
    });
  }

  // Handle Event Types

  const event = req.body.event;
  const payload = req.body.payload;

  console.log(`Received event: ${event}`);

  if (event === "meeting.started") {
    console.log("Meeting started:", payload.object.id);
    // Save meeting ID, start time, topic, host_id, etc.
  }

  if (event === "meeting.ended") {
    console.log("Meeting ended:", payload.object.id);
    // Update meeting record to mark it as ended
  }

  res.sendStatus(200);
});

// Ping Zoom API
app.get("/api/ping", async (req, res) => {
  console.log("Pinging Zoom API...");
  const token = ZOOM_SECRET;
  try {
    const response = await axios.get("https://api.zoom.us/v2/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error pinging Zoom API:", error.message);
    res.status(500).json({ error: "Failed to ping Zoom API" });
  }
});

// Fetch Recordings

app.get("/api/recordings", async (req, res) => {
  console.log("Fetching recordings from Zoom API...");
  const token = ZOOM_SECRET;
  const fetchRecordings = async (token) => {
    try {
      console.log("Trying...");
      const res = await axios.get(
        `https://api.zoom.us/v2/users/me/recordings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Recordings fetched:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching recordings:", error.message);
      throw error;
    }
  };
});

// --- OpenAI Endpoints --- //

console.log("OpenAI Key:", process.env.OPENAI_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

// AI Summarizer
app.post("/api/summarize", async (req, res) => {
  console.log("Reaching the summarize endpoint");
  const { transcription } = req.body;

  if (!transcription)
    return res.status(400).json({ error: "Missing transcription" });

  try {
    // Generate summary
    const summaryCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a meeting assistant. Summarize meetings.",
        },
        {
          role: "user",
          content: `Summarize the following transcript into concise bullet points:\n\n${transcription}`,
        },
      ],
    });

    const summary = summaryCompletion.choices[0].message.content.trim();

    console.log("Summary:", summary);
    // Generate next steps
    const nextStepsCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a meeting assistant. Identify next steps from meetings.",
        },
        {
          role: "user",
          content: `Based on the following transcript, list clear next steps in bullet points:\n\n${transcription}`,
        },
      ],
    });

    const nextSteps = nextStepsCompletion.choices[0].message.content.trim();

    console.log("Next Steps:", nextSteps);

    res.json({ summary, nextSteps });
    console.log("Wrapped up in the server.");
    return res;
  } catch (err) {
    console.error("OpenAI error:", err.message);
    res.status(500).json({ error: "Failed to generate summary or next steps" });
  }
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
