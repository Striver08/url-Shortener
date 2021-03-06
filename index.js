const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const port = 3000

const static = express.static("public");
app.use(static)
app.use(bodyParser.json())

var admin = require("firebase-admin");

var serviceAccount = require("./shorten-4fb3d-firebase-adminsdk-276hi-23929462bd.json");
const { response } = require("express");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const urlsdb = admin.firestore().collection("urlsdb");
const usersdb = admin.firestore().collection("usersdb");

app.get('/', (req,res)=> {
    res.send("Hello World!!!")
})

app.post("/admin/urls/", (req, res) => {
    const {email, password, short, url} = req.body;

    usersdb.doc(email).get().then(response => {
        const user = response.data()
        console.log(user)

        if(user && (user.email == email) && (user.password == password)){
            const doc = urlsdb.doc(short);
            doc.set({url});
            res.send("It's Done!!!")
        } else {
             res.send(403, "Not Found")
        }
    })

})

app.get("/:short", (req,res) => {
    console.log(req.params)
    const short = req.params.short
    const doc = urlsdb.doc(short);

    doc.get().then(response => {
        const data = response.data();
        //console.log(data)
        if(data && data.url) {
            res.redirect(301, data.url)
        } else {
            res.redirect(301, "https://linkedin.com")
        }
    })

    //res.send("We will redirect you to "+short)
})




app.listen(port, () => {
    console.log("App listening at Port "+3000)
})