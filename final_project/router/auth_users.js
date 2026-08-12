const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //Code to check is the username is valid
    let userwithsamename = users.filter(user => {return user.username === username;});

    if (userwithsamename.length > 0) {
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username, password)=>{ //returns boolean
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    //Authenticate user
    if (authenticatedUser(username, password)) {
        //Generate JWT access token
        let accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60 * 60});

        //Store access token and username in session
        req.session.authorization = {accessToken, username}
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const ISBN = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;
    const bookReviews = books[ISBN].reviews;

    if (Object.hasOwn(bookReviews, username)) {
        bookReviews.review = review;
        return res.send("Review successfully modified!");
    } else {
        bookReviews[username] = review;
        return res.send("Review successfully added!");
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const ISBN = req.params.isbn;
    const username = req.session.authorization.username;
    const reviews = books[ISBN].reviews;

    if (Object.hasOwn(reviews, username)) {
        delete books[ISBN].reviews[username];
        return res.send("Review successfully deleted!")
    } else {
        return res.send("You have not added a review yet!")
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
