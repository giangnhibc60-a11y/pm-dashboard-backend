import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { tasks } from './schema/tasks.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database connection
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

app.use(cors());
app.use(express.json()); // Essential: allows reading JSON sent by script.js

// POST route to insert task into database
app.post('/api/tasks', async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    // Insert into PostgreSQL via Drizzle
    const [newTask] = await db.insert(tasks).values({ title }).returning();
    console.log('Saved to DB:', newTask); // Log to server terminal
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Database Insert Error:", error);
    res.status(500).json({ error: "Failed to insert into database" });
  }
});

// GET route to read tasks from database
app.get('/api/tasks', async (req, res) => {
  try {
    const allTasks = await db.select().from(tasks);
    res.json(allTasks);
  } catch (error) {
    console.error("Database Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});