const express = require('express');
const webpush = require('web-push');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require("node-fetch");
const mongo = require('mongodb').MongoClient;
const app = express();
const PUBLIC_VAPID = 'BBBVwkbvAKSu6tXBnBOco2qjiY5nm222XxwVQnoWNNaIBMdSHtFHWTSUbjEIVxfR9zpBY-Lrl7cTp5lu5jIrSPs';
const PRIVATE_VAPID = 'SAn9kC_yWHJUuPGto4iQcF2vecfYrhD3HULzE8JF5Jk';
let projects_date
let projects_name = []
let products_email = []
let projects_Id = []
var count
var url = "mongodb://139.5.145.4:8000";

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cors());
app.use(bodyParser.json());

app.post('/insertdata', (req, res) => {
    clearInterval(count)
    countdown()
})

async function countdown() {
    await fetch('http://192.168.99.100:8080/api/projects')
        .then(res => res.text())
        .then(body => JSON.parse(body))
        .then(data => {
            projects_Id = []
            projects_name = []
            products_email = []
            projects_date = null
            for (let item in data.data) {
                var date = parseInt(data.data[item].launch_date.$date.$numberLong)
                if (!projects_date || projects_date > date) {
                    projects_Id = []
                    projects_name = []
                    products_email = []
                    projects_date = date
                    projects_name.push(data.data[item].project)
                    projects_Id.push(data.data[item]._id)
                    products_email.push(data.data[item].product_owner.email)
                }
                else if (projects_date && projects_date == date) {
                    projects_name.push(data.data[item].project)
                    projects_Id.push(data.data[item]._id)
                    products_email.push(data.data[item].product_owner.email)
                }
            }
            count = setInterval(async function () {
                var now = new Date().getTime();
                var distance = projects_date - now;
                if (distance < 0 && projects_date) {
                    clearInterval(count);
                    if(projects_name.length != 0)
                    {
                        patchprojectStatus()
                        await mongo.connect(url, { useNewUrlParser: true }, function (err, db) {
                            if (err) throw err;
                            var dbo = db.db('LBA_db')
                            dbo.collection('subUser').find().toArray(function (err, d) {
                                if (err) throw err
                                d.forEach(function (sub_user) {
                                    var data = { sub: sub_user, title: `${projects_name}`, body: 'Time out.!!' }
                                    fetch('http://139.5.145.4:3000/sendNotification', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(data)
                                    })
                                })
                                db.close()
                            })
                        });
                        projects_date = null
                    }
                    else{
                        countdown()
                    }
                }
            }, 1000);
        })
}

async function patchprojectStatus() {
    var fetches = [];
    let projectId
    for (let i = 0; i < projects_Id.length; i++) {
        projectId = projects_Id[i]
        fetches.push(fetch(`http://192.168.99.100:8080/api/projects/${projects_Id[i]}?email=${products_email[i]}&status=2`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
        }));
    }
    await Promise.all(fetches).then(function () {
        console.log(`patch ${projectId} status '2' success`)
    })
    countdown()
}

app.get('/', (req, res) => {
    res.send('This is a push notification server use post')
});

app.post('/sendNotification', (req, res) => {

    res.set('Content-Type', 'application/json');
    webpush.setVapidDetails(
        'mailto:dmexist@gmail.com', PUBLIC_VAPID, PRIVATE_VAPID
    );

    let payload = JSON.stringify({
        "notification": {
            "title": `${req.body.title}`,
            "body": `${req.body.body}`,
        }
    });
    mongo.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) {
            throw err;
        }
        var dbo = db.db('LBA_db')
        dbo.collection('subUser').find().toArray(async function (err, d) {
            if (err) throw err
            d.forEach(function (subU) {
                Promise.resolve(webpush.sendNotification(subU, payload))
                .then(() => {
                    res.status(200).json({
                        message: 'Notification sent'
                    })
                })
                .catch(err => {
                    dbo.collection('subUser').deleteOne({'endpoint':subU.endpoint},function(err,obj){
                        if(err) throw err
                        console.log(`delete subUser ${subU.endpoint}`)
                    })
                    console.error(err);
                    res.sendStatus(500);
                })
            })
        });
        db.close();
    })
})

app.post('/subscription', (req, res) => {
    let sub = req.body.sub;
    mongo.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) {
            throw err;
        }
        var dbo = db.db('LBA_db')
        dbo.collection('subUser').find().toArray(async function (err, d) {
            if (err) throw err
            if (d.length != 0) {
                await d.forEach(function (subU) {
                    if (subU.endpoint == sub.endpoint) {
                        db.close()
                        return;
                    }
                })
                dbo.collection('subUser').insertOne(sub, function (err, res) {
                    if (err) throw err;
                    db.close();
                })
            }
            else {
                dbo.collection('subUser').insertOne(sub, function (err, res) {
                    if (err) throw err;
                    db.close();
                })
            }
        })
    });
    res.set('Content-Type', 'application/json');
    webpush.setVapidDetails(
        'mailto:dmexist@gmail.com', PUBLIC_VAPID, PRIVATE_VAPID
    );

    let payload = JSON.stringify({
        "notification": {
            "title": `${req.body.title}`,
            "body": `${req.body.body}`,
            "icon": "assets/icons/icon-512x512.png"
        }
    });

    Promise.resolve(webpush.sendNotification(sub, payload))
        .then(() => {
            res.status(200).json({
                message: 'Notification sent'
            })
        })
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        })
});

const port = process.env.PORT || 3000

app.listen(port, () => {
    countdown()
    console.log(`Server started on port ${port}`);
});