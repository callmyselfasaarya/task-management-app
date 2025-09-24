const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config()
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL, {
	useNewUrlParser: true, 
	useUnifiedTopology: true })
	.then(() => console.log("connected to db"))
	.catch(console.error);

const Task = require('./models/task');

app.get('/tasks', async (req, res) => {
	const tasks = await Task.find();

	res.json(tasks);
});

app.post('/task/new', (req, res) => {
	try {
		const task = new Task({
			text: req.body.text,
			priority: req.body.priority
		});
		return task.save()
			.then((saved) => res.status(201).json(saved))
			.catch((err) => {
				console.error(err);
				return res.status(400).json({ error: 'Failed to create task' });
			});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'Server error' });
	}
});

app.delete('/task/delete/:id', async (req, res) => {
	const result = await Task.findByIdAndDelete(req.params.id);

	res.json({result});
});

app.put('/task/update/:id', async (req, res) => {
	try {
		const task = await Task.findById(req.params.id);
		if (!task) {
			return res.status(404).json({ error: 'Task not found' });
		}
		if (typeof req.body.text === 'string') {
			task.text = req.body.text;
		}
		if (typeof req.body.priority === 'string') {
			task.priority = req.body.priority;
		}
		const saved = await task.save();
		return res.json(saved);
	} catch (err) {
		console.error(err);
		return res.status(400).json({ error: 'Failed to update task' });
	}
});

app.listen(3001);