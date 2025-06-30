const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('AI Meeting Assistant Backend');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});