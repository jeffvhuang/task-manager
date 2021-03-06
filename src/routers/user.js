const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')

//#region User
router.post('/api/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token });
    } catch (e) {
        let msg = e.message;
        errJson = JSON.parse(JSON.stringify(e))
        if (errJson && errJson.code === 11000 && errJson.errmsg && errJson.errmsg.includes('email_1 dup key')) {
            msg = "Account already exists for this email"
        }
            
        res.status(400).send({ error: msg });
    }
})

router.post('/api/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

router.post('/api/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/api/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/api/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// router.get('/users/:id', auth, async (req, res) => {
//     const _id = req.params.id;

//     try {
//         const user = await User.findById(_id);
//         if (!user) {
//             return res.status(404).send({ error: "User not found" });
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send({ error: e.message });
//     }
// })

router.patch('/api/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: "At least one property in object is invalid for updating!" });
    }

    try {
        const { user } = req
        updates.forEach(update =>  user[update] = req.body[update])
        await user.save();
        res.send(user);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

router.delete('/api/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})
//#endregion User

//#region avatar
const upload = multer({
    limits: {
        // Number in bytes. below is 1MB
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a jpg, jpeg or png file'))
        }

        cb(undefined, true)
    }
})

router.post('/api/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    // Ensure smaller image and always png
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/api/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

router.get('/api/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        // set creates key-value pair. Upload method ensured image saved is png format
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})
//#endregion avatar

module.exports = router