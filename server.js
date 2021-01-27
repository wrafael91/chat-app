const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//CONNECTING DATABASE

mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/amateur", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on("error", (error) => {
    if (error) {
        return console.error(error);
    }
});

//We tell Express that we'll be using a static file.
app.use(express.static(__dirname));

//BODY-PARSER: piece of Express middleware that reads a form's input and stores it 
// as a JavaScript object accessible through 'req.body'
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//DEFINE SCHEMA
const Schema = mongoose.Schema({
    name: String,
    message: String
});

//DEFINE MODEL
const Message = mongoose.model('Messages', Schema);

//ROUTES

app.get('/messages', (req, res) => {//GET: will get all the messages from database
    Message.find({}, (error, messages) => {
        res.send(messages);
    });
});

app.post('/messages', (req, res) => {//POST: will post new messages created by the user to the database
    let message = new Message(req.body);
    message.save((error) => {
        if (error) {
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

app.listen(3000, () => {
    console.log("Listening on port 3000")
});