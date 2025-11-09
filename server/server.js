const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

app.use(cors()); 
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('API для Help&Boost працює!');
});
app.use('/uploads', express.static('uploads'));
app.use('/api/contributions', require('./routes/contributionRoutes'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/support', require('./routes/supportRoutes'));
app.use('/api/fundraisers', require('./routes/fundraiserRoutes'));

app.listen(PORT, () => {
  console.log(`Сервер запущено на порті ${PORT}`);
});