const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')
const keys = require('../../src/helpers/keys')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: "Michael Jordan",
    email: 'likemike@example.com',
    password: '123dunkit!!',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, keys.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: "Elon Musk",
    email: 'elon@spacex.com',
    password: 'moon999$',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, keys.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "first task",
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "task 2",
    completed: true,
    owner: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "task three",
    completed: true,
    owner: userTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}