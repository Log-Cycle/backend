const functions = require("firebase-functions");
const express = require('express')
const cors = require('cors')

const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const app = express()

app.use(cors())
app.use(express.json())

initializeApp();


const db = getFirestore();

const docRefCollectionBoxs = db.collection('collectionBoxs')

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/update-location-status/:imei/:level/:battery', async (req, res) => {
    console.log("EXECUTANDO update")
    const { imei, level, battery } = req.params;

    const querySnapshot = await docRefCollectionBoxs.where('IMEI', '==', imei).get();

    if (querySnapshot.empty) {
        return res.status(404).send('Item não encontrado');
    }

    const doc = querySnapshot.docs[0];
    const docId = doc.id;
    const boxHeight = doc.data().height;

    const boxLevel = level / boxHeight * 100;

    await docRefCollectionBoxs.doc(docId).update({ imei, level: boxLevel, battery });

    res.send('Collection box updated successfully');
});

exports.serverHack = functions.https.onRequest(app);