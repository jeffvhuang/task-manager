const express = require('express')
const router = new express.Router()
const Task = require('../models/task')

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);

    try {
        await task.save();
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', async (req, res) => {
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

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(404).send({ error: "At least one property in object is invalid for updating!" });
    }

    try {
        const task = await Task.findById(req.params.id)

        updates.forEach(update =>  task[update] = req.body[update])
        await task.save();

        if (!task) {
            return res.status(404).send({ error: "Task not found" });
        }
        res.send(task);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

router.delete('/tasks/:id', async (req, res) => {
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

module.exports = router