const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());
const authRoutes = require('../routes/auth');
app.use('/api/auth', authRoutes);


describe('Auth API (/api/auth)', () => {

  beforeAll(async () => {
    const mongoURI = process.env.MONGO_URI; 
    if (!mongoURI) {
      throw new Error('помилка: MONGO_URI не визначено в змінних оточення');
    }
    await mongoose.connect(mongoURI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
  it('POST /register -> реєстрація успішна', async () => {
    
    const fakeUser = {
      username: `test_user_${Date.now()}`,
      email: `test_${Date.now()}@test.com`,
      password: 'password123'
    };

    const res = await request(app)
      .post('/api/auth/register')
      .send(fakeUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });
  
  it('POST /login -> невірний пароль', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: `test_fake_${Date.now()}@test.com`, 
        password: 'wrong_password'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.msg).toEqual('Невірні дані для входу');
  });
  it('POST /login -> вхід успішний', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: `test_fake_${Date.now()}@test.com`, 
        password: 'password123'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.msg).toEqual('Невірні дані для входу');
  });

});