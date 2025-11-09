const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const { title, description, category, points, endDate } = req.body;
    
    const pointsAsNumber = parseInt(points);
    if (isNaN(pointsAsNumber)) {
      return res.status(400).json({ msg: 'Бали мають бути цілим числом' });
    }

    const newTask = new Task({
      title,
      description,
      category,
      points: pointsAsNumber, 
      endDate: endDate || null,
      createdBy: req.user.id,
      filePath: req.file ? req.file.path : null 
    });
    
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Помилка на сервері (ймовірно, "забув" "обов\'язкове" "поле")');
  }
};

exports.getOpenTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ status: 'open' })
                             .populate('createdBy', 'username') 
                             .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Помилка на сервері');
  }
};
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
                           .populate('createdBy', 'username');
    if (!task) {
      return res.status(404).json({ msg: 'Завдання не знайдено' });
    }
    res.json(task);
  } catch (err) {
    res.status(500).send('Помилка на сервері');
  }
};

exports.claimTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Завдання не знайдено' });
    if (task.status !== 'open') return res.status(400).json({ msg: 'Завдання вже "в роботі" або "закрите"' });

    task.status = 'in_progress';
    task.assignedTo = req.user.id; 
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).send('Помилка на сервері');
  }
};

exports.abandonTask = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ msg: '"Причина" 100% "обов\'язкова"' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Завдання не знайдено' });
    
    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Це "не" "твоє" "чотке" "завдання"' });
    }

    task.status = 'open'; 
    task.assignedTo = null;
    task.abandonReason = reason; 
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Помилка на сервері');
  }
};
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ 
      assignedTo: req.user.id,
      status: 'in_progress' 
    }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Помилка на сервері');
  }
};