const express = require("express");
const cors = require("cors");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

// Prisma server
const prisma = new PrismaClient();

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // parse JSON body
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.get("/api/notes", async (req, res) => {
  const notes = await prisma.note.findMany();
  res.json(notes);
});

app.post("/api/notes", async (req, res) => {
  const { title, body } = req.body;
  const note = await prisma.note.create({ data: { title, body } });
  res.status(201).json(note);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
