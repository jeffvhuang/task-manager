const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
// Path for the following YAML.load is relative to root
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express()

// app.use((req, res, next) => {
//     res.send(503).send("Site is currently down. Check back soon!")
// })

app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(userRouter)
app.use(taskRouter)

module.exports = app