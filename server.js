const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const path = require('path');

const app = express();

// Database configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Subhash9318',
  database: 'event_form',
});

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  },
});
const upload = multer({ storage });
// Serve static files from the "public" folder
app.use(express.static('public'));

// Serve the event_form.html file for the root route ("/")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'event_form.html'));
});

// Create an event
app.post('/events', upload.single('image'), (req, res) => {
  const { uid, name, tagline, schedule, description, moderator, category, sub_category, rigor_rank, attendees } = req.body;
  const image = req.file ? req.file.filename : null;

  const query = `INSERT INTO events (uid, name, tagline, schedule, description, image, moderator, category, sub_category, rigor_rank, attendees) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [uid, name, tagline, schedule, description, image, moderator, category, sub_category, rigor_rank, attendees];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ message: 'Failed to create event' });
    } else {
      console.log('Event created:', results);
      res.json({ message: 'Event created successfully' });
    }
  });
});

// Retrieve all events
app.get('/events', (req, res) => {
  const query = `SELECT * FROM events`;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error retrieving events:', error);
      res.status(500).json({ message: 'Failed to retrieve events' });
    } else {
      console.log('Events retrieved:', results);
      res.json(results);
    }
  });
});

// Retrieve a single event
app.get('/events/:eventId', (req, res) => {
  const eventId = req.params.eventId;
  const query = `SELECT * FROM events WHERE id = ?`;
  const values = [eventId];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Error retrieving event:', error);
      res.status(500).json({ message: 'Failed to retrieve event' });
    } else {
      if (results.length > 0) {
        console.log('Event retrieved:', results[0]);
        res.json(results[0]);
      } else {
        res.status(404).json({ message: 'Event not found' });
      }
    }
  });
});

// Update an event
app.put('/events/:eventId', upload.single('image'), (req, res) => {
  const eventId = req.params.eventId;
  const { uid, name, tagline, schedule, description, moderator, category, sub_category, rigor_rank, attendees } = req.body;
  const image = req.file ? req.file.filename : null;

  const query = `UPDATE events SET uid = ?, name = ?, tagline = ?, schedule = ?, description = ?, image = ?, moderator = ?, category = ?, sub_category = ?, rigor_rank = ?, attendees = ? WHERE id = ?`;
  const values = [uid, name, tagline, schedule, description, image, moderator, category, sub_category, rigor_rank, attendees, eventId];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ message: 'Failed to update event' });
    } else {
      if (results.affectedRows > 0) {
        console.log('Event updated:', results);
        res.json({ message: 'Event updated successfully' });
      } else {
        res.status(404).json({ message: 'Event not found' });
      }
    }
  });
});

// Delete an event
app.delete('/events/:eventId', (req, res) => {
  const eventId = req.params.eventId;
  const query = `DELETE FROM events WHERE id = ?`;
  const values = [eventId];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ message: 'Failed to delete event' });
    } else {
      if (results.affectedRows > 0) {
        console.log('Event deleted:', results);
        res.json({ message: 'Event deleted successfully' });
      } else {
        res.status(404).json({ message: 'Event not found' });
      }
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
