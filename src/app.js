require('dotenv').config()
const express = require('express');
const app = express();
const cookieSession = require('cookie-session')
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const hbs = require("hbs");
const bodyParser = require("body-Parser");

require('./passport-setup');
const port = process.env.PORT || 5000;

// mongoose connection
require('./mongocon')

// require scema
const TodoModel = require("./todo");
const { METHODS } = require('http');

// require timeDateformat from moment
const timeDateFormat = require("./moment")
const { date, time } = timeDateFormat();
console.log(date)

// middleware
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser());

// set static path here to
const staticPath = path.join(__dirname, '../public');
app.use(express.static(staticPath))

// set defaults engine
app.set("view engine", "hbs")

// set view engine defaults
const template = path.join(__dirname, '../templates/views');
app.set("views", template);

// set partial hbs
const partial = path.join(__dirname, '../templates/partials');
hbs.registerPartials(partial)

// set cokies
app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
}))

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        // console.log("app", req.user)
        next();
    } else {
        res.sendStatus(401);
    }
}

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());


// set passport
app.get('/', (req, res) => res.render('index'))
app.get('/failed', (req, res) => res.send('You Failed to log in!'))

// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get('/users', isLoggedIn, (req, res) => {
    res.render("pro", { name: req.user.displayName, pic: req.user.photos[0].value, email: req.user.emails[0].value })
})

// Auth Routes
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/users');
    }
);

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})


// get request
app.get("/homedash", async (req, res) => {
    try {
        let data = await TodoModel.find();
        // console.log(data)
        res.status(200).render("home", {
            data: data,
        })
    } catch (error) {
        console.log(error)
    }
})
app.get("/add", (req, res) => {

    res.status(200).render("collection")

})


app.get("/send", async (req, res) => {
    try {
        let data = await TodoModel.find();
        // console.log(data)
        res.status(200).render("home", {
            data: data,
        })
    } catch (error) {
        console.log(error)
    }
})
app.post("/send", async (req, res) => {
    try {
        const newData = new TodoModel(req.body);
        const setDataToDatabase = await newData.save();
        // console.log(setDataToDatabase)

        let data = await TodoModel.find();
        res.status(200).render("home", {
            data: data,

        })
    } catch (error) {
        res.status(400).render(error)
    }
})

app.get("/homedash", (req, res) => {
    res.redirect("/home")
})

// get todo request
app.get("/todo", async (req, res) => {
    try {
        res.status(200).render("todo");
    } catch (error) {
        console.log(error)
    }
})

// search todo here code
app.get("/todoSearch", async (req, res) => {
    try {
        res.status(200).render("todo")
    } catch (error) {
        console.log(error)
    }
})

app.post("/todoSearch", async (req, res) => {
    try {
        let searchKey = req.body.query;

        // get data from database
        let data = await TodoModel.find({ title: searchKey });
        // console.log(data[0])
        if (data[0] != undefined) {
            res.status(200).render("todo", {
                match: "Success Search Your Data",
                data: data
            })
        }
        else {
            res.status(200).render("todo", {
                match: "Not Matched",
                data: data
            })
        }
    } catch (error) {
        console.log(error)
    }
})

// end

// search Query with title and desc

// deletData from database
app.post("/delete", async (req, res, next) => {
    try {
        let deleteId = (req.body.delete)

        // delete data form database
        let deletedata = await TodoModel.findByIdAndDelete(deleteId);

        // fetch data form database
        let data = await TodoModel.find();
        if (data.length < 0) {
            res.status(200).render("home", {
                item: "Your Item Is Empty Please Add New Item"
            })
        }
        else {
            res.status(200).render("home", {
                data: data
            })
        }
    } catch (error) {
        console.log(error)
    }
})

// get METHODS

app.get("/edit", async (req, res) => {
    try {
        let data = await TodoModel.find();
        // console.log(data)
        res.status(200).render("home", {
            data: data
        })
    } catch (error) {
        console.log(error)
    }
})
// edit and update
app.post("/edit", async (req, res) => {
    try {
        let editId = (req.body.edit)// id come from home page edit form 

        // edit data form database findByIdAndUpdate
        let editdata = await TodoModel.findById(editId);
        let title = editdata.title;
        let desc = editdata.desc;
        // console.log(editdata)
        res.status(200).render("collection", {
            title: title,
            desc: desc
        })
        // let first delete the edit data
        let deletedata = await TodoModel.findByIdAndDelete(editId);
    } catch (error) {
        console.log(error)
    }
})


// app listen
app.listen(port, () => {
    console.log("app is running on port ", port)
})
