const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        //Check if the user does not already exists
        if (isValid) {
            //Add user to the array
            users.push({"username": username, "password": password})
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    } else {
        // Return error if username or password is missing
        return res.status(404).json({message: "Unable to register user."});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Send the data as text/html
    return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    const book = books[ISBN];

    //If book exists return it, otherwise send an error message
    if (book) {
        return res.json(book);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const keys = Object.keys(books);
    const all_books = {};

    for (const key of keys) {
        if (author === books[key].author) {
            all_books[key] = books[key];
        }
    }

    if (Object.keys(all_books).length !== 0) {
        return res.json(all_books);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const keys = Object.keys(books);
    const all_books = {};

    for (const key of keys) {
        if (title === books[key].title) {
            all_books[key] = books[key];
        }
    }

    if (Object.keys(all_books).length !== 0) {
        return res.json(all_books);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    const book = books[ISBN].reviews;

    //If book exists return its reviews, otherwise send an error message
    if (book) {
        return res.json(book);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

module.exports.general = public_users;
