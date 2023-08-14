const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Routes for users
const users = [];

app.get('/users', (req, res) => {
  res.json(users);
});

app.post('/users', async (req, res) => {
  try {
    const saltRounds = 10; // Number of salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const user = { name: req.body.name, password: hashedPassword };
    users.push(user);
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

// Login route
app.post('/login', async (req, res) => {
  const user = users.find(u => u.name === req.body.name);
  if (!user) return res.status(404).send('User not found');

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send('Login successful');
    } else {
      res.send('Invalid password');
    }
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});
