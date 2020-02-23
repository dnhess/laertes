const { db, admin } = require('../util/admin')
const config = require('../util/config')
const firebase = require('firebase')
const { validateSignupData, validateLoginData } = require('../util/validators')
firebase.initializeApp(config)

exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    }

    const { valid, errors } = validateSignupData(newUser)

    if(!valid) return res.status(400).json(errors)

    const noImage = 'no-image.svg'
    let token, userId

    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if(doc.exists) {
                return res.status(400).json({ handle: 'this handle is already taken' })
            } else {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(newUser.email, newUser.password)
            }
        })
        .then(data => {
            userId = data.user.uid
            return data.user.getIdToken()
        })
        .then(resToken => {
            token = resToken
            const userCred = {
                handle: newUser.handle,
                email: newUser.email,
                created_at: new Date().toISOString(),
                userId,
                avatar: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImage}?alt=media`
            }
            return db.doc(`/users/${newUser.handle}`).set(userCred)
        })
        .then((() => {
            return res.status(201).json({ token })
        }))
        .catch(err => {
            console.error(err)
            if(err.code === "auth/email-already-in-use") {
                return res.status(400).json({ email: 'Email is already in use'})
            } else {
                return res.status(500).json({ error: err.code })
            }
        })
}

exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }

    const { valid, errors } = validateLoginData(newUser)

    if(!valid) return res.status(400).json(errors)

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken()
        })
        .then(token => {
            return res.json({ token })
        })
        .catch(err => {
            console.error(err)
            if(err.code === 'auth/wrong-password') {
                return res.status(403).json({ general: 'Wrong credentials, please try again'})
            }
            return res.status(500).json({ error: err.code })
        })
}

exports.uploadImage = (req, res) => {
    const BusBoy = require('busboy')
    const path = require('path')
    const os = require('os')
    const fs = require('fs')

    const busboy = new BusBoy({ headers: req.headers })

    let imageFileName
    let imageToBeUploaded = {}


    // eslint-disable-next-line consistent-return
    busboy.on('file', (fieldName, file, fileName, encoding, mimeType) => {
        if(mimeType !== 'image/jpeg' && mimeType !== 'image/png') {
            return res.status(400).json({ error: 'Wrong file type'})
        }
        const imageExtension = fileName.split('.')[fileName.split('.').length - 1]
        imageFileName = `${Math.round(Math.random() * 1000000000000)}.${imageExtension}`
        const filePath = path.join(os.tmpdir(), imageFileName)
        imageToBeUploaded = { filePath, mimeType}
        file.pipe(fs.createWriteStream(filePath))
    })

    busboy.on('finish', () => {
        admin.storage().bucket(`${config.storageBucket}`).upload(imageToBeUploaded.filePath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimeType
                }
            }
        })
        .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}_200x200?alt=media`
            return db.doc(`/users/${req.user.handle}`).update({ avatar: imageUrl})
        })
        .then(() => {
            return res.json({ message: 'Image uploaded successfully' })
        })
        .catch(err => {
            console.error(err)
            return res.status(500).json({ error: err.code })
        })
    })
    busboy.end(req.rawBody)
}