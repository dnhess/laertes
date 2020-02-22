const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp()

const express = require('express')
const app = express()

app.get('/screams', (req, res) => {
    admin.firestore()
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

app.post('/scream', (req, res) => {
    if(req.method !== 'POST') {
        return res.status(400).json({ error: "Method not allowed"})
    }
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        created_at: new Date().toISOString()
    };

    admin.firestore().collection('screams').add(newScream)
        .then(doc => {
            return res.json({ message: `document ${doc.id} created successfully`})
        })
        .catch(err => {
            res.status(500).json({ error: 'something went wrong'})
            console.error(err)
        })
})

// https://baseurl.com/api/screams

exports.api = functions.https.onRequest(app)