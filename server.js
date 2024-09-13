const express = require("express");
const app = express();
const port = 3008;

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");

const serviceAccount = require("./key12.json");

initializeApp({
    credential: cert(serviceAccount),
});

const db = getFirestore();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.get("/", (req, res) => {
    res.render("login");
});
app.get("/signin", (req, res) => {
    res.render("login");
});
app.post("/signin", (req, res) => {
    const { emailid, password } = req.body;
    db.collection('dolphin').where("email", "==", emailid).where("password", "==", password).get()
        .then((docs) => {
            if (docs.size > 0) {
                res.redirect("/books");
            } else {
                res.send("Wrong credentials");
            }
        });
});
app.get("/signup", (req, res) => {
    res.render("signup");
});
app.post("/signup", (req, res) => {
    const { full_name, emailid, password } = req.body;
    db.collection('dolphin').add({
        full_name: full_name,
        email: emailid,
        password: password,
    }).then(() => {
        res.redirect("/signin");
    });
});
app.get("/books", (req, res) => {
    db.collection('books').get()
        .then(snapshot => {
            const books = snapshot.docs.map(doc => doc.data());
            res.render("books", { books: books });
        });
});
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
