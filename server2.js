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
db.collection('notes', function(error, notes) {
    db.notes = notes;
});

db.collection('sections', function(error, sections) {
    db.sections = sections;
});


app.get("/notes", function(req,res) {
    db.notes.find(req.query).toArray(function(err, items) {
        res.send(items);
    });
});

app.get("/setorder", function(req,res) {
    var obj = {};
    obj[req.query.order] = 1;
    db.notes.find().sort(obj).toArray(function(err, items) {
        res.send(items);
    });
});

app.get("/updatenotes", function(req,res) {
    var newVal = req.query.new;
    var oldVal = req.query.old;

    // obj[req.query.order] = 1;
    // db.notes.find().sort(obj).toArray(function(err, items) {
    //     res.send(items);
    // });
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

app.post("/top", function(req,res) {
    if (db.notes.drop()) {
        db.notes.insert(req.body);
    } else {
        res.end(false);
    }
});

app.delete("/notes", function(req,res) {

    var id = new ObjectID(req.query.id);
    db.notes.remove({_id: id}, function(err){
        if (err) {

            res.send("Failed");
        } else {
            res.send("Success");
        }
    })
});

// app.get("/notes", function(req,res) {
//     res.send(req.session.notes || []);
// });

// app.post("/notes", function(req, res) {
//     if (!req.session.notes) {
//         req.session.notes = [];
//         req.session.last_note_id = 0;
//     }
//
//     const note = req.body;
//
//     note.id = req.session.last_note_id;
//
//     req.session.last_note_id++;
//     req.session.notes.push(note);
//     res.end();
// });

/******************************************************************/

// app.post("/notes", function(req, res) {
//     const note = req.body;
//
//     if (!req.session.last_note_id) {
//         req.session.last_note_id = 0;
//     }
//
//     note.id = req.session.last_note_id;
//
//     req.session.last_note_id++;
//
//     const noteText = JSON.stringify(note)+"\n";
//
//
//     fs.appendFile("notes.json", noteText, function(err) {
//         if (err) console.log("something is wrong");
//         res.end();
//     });
// });
//
//
// app.get("/notes", function(req,res) {
//     fs.readFile("notes.json", function(err, result) {
//         if (result) {
//             result = ""+result;
//             result = result.substring(0, result.length - 1);
//             result = "["+result+"]";
//             result = result.split("\n").join(",");
//             res.send(result);
//         } else {
//             res.end();
//         }
//     });
// });
//
// app.delete("/notes", function(req,res) {
//     const id = req.query.id;
//     fs.readFile("notes.json", function(err, result) {
//         if (result) {
//             result = ""+result;
//             result = result.substring(0, result.length - 1);
//             result = "["+result+"]";
//             result = result.split("\n").join(",");
//
//             const notes = JSON.parse(result);
//
//             let targetId = findElem(notes, id);
//
//             notes.splice(targetId , 1);
//
//             let notesText = "";
//
//             notes.forEach(note => {
//                 notesText += JSON.stringify(note) + "\n";
//             });
//
//             fs.writeFile("notes.json", notesText, function(error, success) {
//                 if (error) {
//                     throw error
//                 }
//
//                 res.end();
//             });
//         }
//     });
//
// });


// function findElem(arr, id) {
//     let index = 0;
//
//     arr.forEach((elem, i) => {
//         if (+elem.id === +id) {index = i};
//     });
//
//     return index;
// }
//
// app.post("/update", function(req, res) {
//     const note = req.body;
//     let noteText = '';
//     note.forEach(note => {
//         noteText += JSON.stringify(note) + "\n";
//     });
//
//     fs.writeFile("notes.json", noteText, function(error, success) {
//         if (error) {
//             throw error
//         }
//         res.end();
//     });
// });


/******************************************************************/

// app.delete("/notes", function(req,res) {
//     const id = req.query.id;
//     const notes = req.session.notes||[];
//     const updatedNotesList = [];
//
//     for (let i=0;i<notes.length;i++) {
//         if (notes[i].id != id) {
//             updatedNotesList.push(notes[i]);
//         }
//     }
//
//     req.session.notes = updatedNotesList;
//     res.end();
// });

// app.post("/update", function(req, res) {
//     req.session.notes = req.body;
//     res.end();
// });





// app.get("/greeting", function (req, res) {
//     res.send(sayHello(req));
// });
//
// app.get("/users", function (req, res) {
//     const user = req.query.id;
//
//     res.send(db[req.query.id]);
// });

// fs.readFile(path.join(__dirname, 'public/data/notes.json'), function (err, logData) {
//     if (err) throw err;
//
//     const notes = logData.toString();
//
//     app.get("/notes", function (req, res) {
//         res.send(notes);
//     });
// });




// app.get("/notes", function(req,res) {
//     const query =  req.query.note;
//     console.log(req.url);
//     console.log(query);
//     if (req.url === "/notes") {
//         res.send(notes);
//         return;
//     } else  {
//         const response = notes.filter(note => {
//             return note.text.toLowerCase().indexOf(query.toLowerCase()) !== -1;
//         });
//
//         res.send(response);
//     }
// });
//
// function sayHello(req) {
//     return "Hello, " + req.query.name + "! I’m server!"
// }
//
// const db = {
//     1: "Roman",
//     2: "Sor"
// };

