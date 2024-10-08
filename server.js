const express = require("express");
const { default: mongoose, Schema, mongo } = require("mongoose");
const app = express();
require("dotenv").config();
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const { error } = require("console");

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads")
    },
    filename: function (req, file, cb) {
        console.log(file);
        const ext = path.extname(file.originalname);
        console.log("EXT", ext);
        // if(ext !== ".png" || ext !== ".jpg") {
        //     return cb(new Error("Only PNG FILES allowed, stay away Martin!"))
        // } 
        const fileName = file.originalname;
        cb(null, fileName)
    }

})


const uploads = multer({
    storage: diskStorage,

})


// const uploads = multer({
//     storage: diskStorage, 
// })




require("dotenv").config();

// const Schema = mongoose.Schema

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/BSuke37")
.then(() => console.log("connected"))
.catch((error) => console.log("error", error));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const GuideSchema = new Schema({
    tittel: String,
    tag: String,
    tittel: Array,
    beskrivelse: Array,
    bilde: Array,
}) 

const User = mongoose.model("User", userSchema);
const BrukerGuide = mongoose.model("BrukerGuide", GuideSchema);
const saltRounds = 10;

app.get("/", (req, res) => {
    BrukerGuide.find().then((guides)=> {
        res.render("index", {guides})

    })
})





app.get("/nyguide", (req, res) => {
    res.render("nyguide")
})

app.post("/nyguide", uploads.array("bilde"), async (req, res) => {
    console.log(req.body, "BODY");
    console.log(req.files, "FILE");

    const newBrukerGuide = new BrukerGuide({ 
        tittel: req.body.tittel, 
        tag: req.body.tag,
         overskrift: req.body.overskrift, 
         beskrivelse: req.body.beskrivelse,
        bilde: req.files })
    const result = await newBrukerGuide.save();
})

app.get("/login", (req, res) =>{
    res.render("login")
})
app.post("/login", (req, res) =>{
    console.log(req.body);
    const {email, password} = req.body;

    User.findOne({email: email}).then((user) => {
        console.log("result", user);

        bcrypt.compare(password, user.password).then((result) => {
            if(result){
                res.status(200).redirect("/")
            }
        })

        
    }).catch((error) => {
        console.log("Error", error)
    })

    console.log(brukernavn);
})


app.get("/guide", (req, res) =>{
    res.render("guide")
})

app.get("/login", (req, res) =>{
    console.log("logger ut her", req.body);
    const {brukernavn, passord} = req.body;

    console.log(brukernavn)
});

app.get("/createUser", (req, res) => {
    res.render("createUser")
});

// const userSchema = new Schema({
//     email: String,
//     password: String
// })



app.post("/createUser", async (req, res) => {
    console.log("Logger ut her", req.body);
    const {email, password, GjentaPassord} = req.body;

    if(password == GjentaPassord){

        bcrypt.hash(password, saltRounds,async function(error,hash) {
           const newUser = new User({email: email, password: hash})

            const result = await newUser.save();
            console.log(result);

            if(result._id) {
            res.redirect("/login");
            } 
        })
        
    }else{
        res.status(500).json({message: "Passord stemmer ikke overens"})
    }
    
});
app.get('/guide/:id', (req, res) => {
    const guideId = req.params.id;
    
    // Finn guiden med matchende _id
    const guide = guides.find(g => g._id === guideId);

    // Hvis guiden finnes, rendere guide-siden, hvis ikke, returner 404
    if (guide) {
        res.render('guide', { guide });
    } else {
        res.status(404).send('Guide ikke funnet');
    }
});

app.listen(process.env.PORT);