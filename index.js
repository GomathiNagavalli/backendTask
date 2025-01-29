const express = require('express');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

// Routes
app.use('/api', userRoutes);


// Start Server
const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  // Test Database Connection
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

app.get("/", async(req, res) => {
  res.status(200).send({message:"db running"})
})
