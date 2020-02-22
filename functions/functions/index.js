const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')()
admin.initializeApp()

const firebaseConfig = {
    apiKey: "AIzaSyCOKniUk6BJFfngQDx-MWhaPoSSIOh8GSg",
    authDomain: "laertes-b1c3e.firebaseapp.com",
    databaseURL: "https://laertes-b1c3e.firebaseio.com",
    projectId: "laertes-b1c3e",
    storageBucket: "laertes-b1c3e.appspot.com",
    messagingSenderId: "308458925504",
    appId: "1:308458925504:web:46082e83e2259d2f44ec25",
    measurementId: "G-QBP0MYZVW9"
  };

const firebase = require('firebase')
firebase.initializeApp(firebaseConfig)

const db = admin.firestore()

app.get('/screams', (req, res) => {
    db
    .collection('screams')
    .orderBy('created_at', 'desc')
    .get()
    .then(data => {
        let screams = []
        data.forEach(doc => {
            screams.push({
                screamId: doc.id,
                ...doc.data()
            })
        })
        return res.json(screams)
    })
    .catch(err => {
        console.error(err)
    })
})

const FBAuth = (res, req, next) => {
    let idToken
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1]
    } else {
        console.error('No token found')
        return res.status(403).json({ error: 'Unauthorized'})
    }

    admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken
            return db.collection('users')
                .where('userId', '==', req.user.uid)
                .limit(1)
                .get()
        })
        .then(data => {
            req.user.handle = data.docs[0].data().handle
            return next()
        })
        .catch(err => {
            console.error('Error while verifying token ', err)
            return res.status(403).json(err)
        })
}

// eslint-disable-next-line consistent-return
app.post('/scream', FBAuth, (req, res) => {
    if(req.method !== 'POST') {
        return res.status(400).json({ error: "Method not allowed"})
    }
    const newScream = {
        body: req.body.body,
        userHandle: req.user.handle,
        created_at: new Date().toISOString()
    };

    db.collection('screams').add(newScream)
        .then(doc => {
            return res.json({ message: `document ${doc.id} created successfully`})
        })
        .catch(err => {
            res.status(500).json({ error: 'something went wrong'})
            console.error(err)
        })
})

const isEmpty = string => {
    if(string.trim() === '') return true
    else return false
}

const isEmail = email => {
    const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx)) return false
    else return true
}


// Signup Route
// eslint-disable-next-line consistent-return
app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    }

    let errors = {}

    if(isEmpty(newUser.email)) {
        errors.email = 'Must not be empty'
    } else if(isEmail(newUser.email)) {
        errors.email = 'Must be a valid email address'
    }

    if(isEmpty(newUser.password)) {
        errors.password = 'Must not be empty'
    }
    
    if(newUser.password !== newUser.confirmPassword) {
        errors.confirmPassword = 'Passwords must match'
    }

    if(isEmpty(newUser.handle)) {
        errors.handle = 'Must not be empty'
    }

    if(Object.keys(errors).length > 0) return res.status(400).json(errors)
    // TODO: Validate Data
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
                userId
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
})

app.post('/login', (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }

    let errors = {}

    if(isEmpty(user.email)) {
        errors.email = 'Must not be empty'
    }

    if(isEmpty(user.password)) {
        errors.password = 'Must not be empty'
    }

    if(Object.keys(errors).length > 0) return res.status(400).json(errors)

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
})

exports.api = functions.https.onRequest(app)