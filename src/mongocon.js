// make connection

const { checkPrime } = require("crypto")
const mongoose = require("mongoose")

const check_prime = async () => {
    try {
        //
        //mongodb://localhost:27017/todoapp
        await mongoose.connect("mongodb+srv://db:6O3rHBpJYYLnGjbV@database.l2fnk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,

        }).then((con) => {
            console.log("connected")
        }).catch((err) => {
            console.log("error")
        })
    } catch (error) {
        console.log("error")
    }

}
check_prime()