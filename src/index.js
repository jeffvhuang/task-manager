const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save();
        res.status(201).send(user);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
})

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users)
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

app.get('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }
        res.send(user);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

app.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(404).send({ error: "At least one property in object is invalid for updating!" });
    }

    try {
        // new: true ensures updated object is returned
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }
        res.send(user);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            res.status(404).send({ error: "User not found" })
        }
        res.send(user)
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body);

    try {
        await task.save();
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) {
        res.status(500).send()
    }
})

app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findById(_id)
        if (!task) {
            return res.status(404).send({ error: "Task not found" })
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

app.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(404).send({ error: "At least one property in object is invalid for updating!" });
    }

    try {
        // new: true ensures updated object is returned
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!task) {
            return res.status(404).send({ error: "Task not found" });
        }
        res.send(task);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            res.status(404).send({ error: "Task not found" })
        }
        res.send(task)
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

app.listen(port, () => {
    console.log('Server is up on port ', port);
})