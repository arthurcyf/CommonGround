const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userEventRoute = require("./routes/userEvent");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/user-events", userEventRoute);


// Default route for '/'
app.get("/", (req, res) => {
    res.send("Welcome to the backend server!"); // Add a message for clarity
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});