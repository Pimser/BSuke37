const express = require("express");
const { default: mongoose, Schema, mongo } = require("mongoose");
const app = express();
const bcrypt = require("bcrypt");


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

const User = mongoose.model("User", userSchema);

const saltRounds = 10;

app.get("/", (req, res) => {
    res.render("index")
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


app.listen(process.env.PORT);