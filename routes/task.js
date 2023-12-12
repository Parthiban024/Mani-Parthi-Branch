import express from 'express';
const router = express.Router();

import Task from '../models/task.model.js';

// Fetch all attendance data
router.route('/fetch/task-data').get((req, res) => {
    Task.find()
    .then((task) => res.json(task))
    .catch((err) => res.status(400).json('Error:' + err));
});

// Save attendance data
router.route('/new').post(async (req, res) => {
  try {
    const { createTask } = req.body;
    

    const newTask = new Task({
        createTask,
    });

    await newTask.save();
    res.json('Task Created!!!');
  } catch (error) {
    res.status(400).json('Error:' + error);
  }
});



// ... (Other routes)

export default router;
