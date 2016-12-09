const express = require('express');
const app = express();
const path = require('path');
const url = require('url');
const fs = require('fs');
const session = require('express-session');
const bodyParser = require('body-parser');
var MongoStore = require('connect-mongo/es5')(session);
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var ObjectID = require('mongodb').ObjectID;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.listen(3000);

// app.use(session({
//     secret: 'angular_tutorial',
//     resave: true,
//     saveUninitialized: true
// }));
app.use(session({
    store: new MongoStore({
        url: 'mongodb://localhost:27017/angular_session'
    }),
    secret: 'angular_tutorial',
    resave: true,
    saveUninitialized: true
}));

var db = new Db('tutor',
    new Server("localhost", 27017, {safe: true},
        {auto_reconnect: true}, {}));
db.open(function(){
    console.log("mongo db is opened!");
});

/* ========= NOTES ============ */

db.collection('notes', function(error, notes) {
    db.notes = notes;
});

app.post("/notes", function(req,res) {
    var reqBody = req.body;
    db.notes.find().sort( { order: -1 } ).limit(1).toArray(function (err,notes) {
        if(notes.length) {
            reqBody.order = notes[0].order-1;
        } else {
            reqBody.order = 0;
        }
        db.notes.insert(reqBody);
        if (!db.counters) res.end();
    });
});

app.get("/notes", function(req,res) {
    setUserQuery(req);
    db.notes.find(req.query).toArray(function(err, items) {
        if (!err) {
            res.send(items);
        }
    });
});

/* ========= END NOTES ============ */

/* ========= SECTIONS ========== */

db.collection('sections', function(error, sections) {
    db.sections = sections;
});

app.get("/sections", function(req,res) {
    var userName = req.session.userName || "demo";
    db.users.find({userName:userName})
        .toArray(function(err, items) {
            var user = items[0];
            res.send(user.sections);
        });
});

app.post("/sections/replace", function(req,res) {
        var userName = req.session.userName || "demo";
        console.log(req.body);
        db.users.update({userName:userName},
            {$set:{sections:req.body}},
            function() {
                res.end();
            });
        // if (req.body.length==0) {
        //     resp.end();
        // }
        // req.body.userName = userName;
        // console.log(req.body);
        // db.sections.remove({}, function(err, res) {
        //     if (err) console.log(err);
        //     db.sections.insert(req.body, function(err, res) {
        //         if (err) console.log("err after insert",err);
        //         resp.end();
        //     });
        // });
});

/* ========= END SECTIONS ==========*/

/* ============= USER ==============*/

function setUserQuery(req) {
    req.query.userName = req.session.userName || "demo";
}

db.collection('users', function(error, users) {
    db.users = users;
});

app.get("/checkUser", function(req,res) {
    db.users.find(req.query).toArray(function (err,users) {
        if (users.length) {
            res.send(false);
        } else {
            res.send(true);
        }
    });
});

app.post("/users", function(req,res) {

    db.users.insert(req.body, function(resp) {
        req.session.userName = req.body.userName;
        res.end();
    });
});

/* ============= END USER ==========*/

/* ============= LOGIN =============*/

app.post("/login", function(req,res) {
    db.users.find(
        {userName:req.body.login,
            password:req.body.password})
        .toArray(function(err, items) {
            if (items.length>0) {
                req.session.userName = req.body.login;
            }
            res.send(items.length>0);
        });
});

app.get("/logout", function(req, res) {
    req.session.userName = null;
    res.end();
});

/* ============= END LOGIN =============*/
