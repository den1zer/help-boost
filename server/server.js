const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/help-and-boost-db')
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Help&Boost API is running!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});