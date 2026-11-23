const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.send(books[isbn]);
    }
    return res.status(404).json({ message: "Book not found" });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let booksbyauthor = [];
    Object.keys(books).forEach((isbn) => {
        if (books[isbn].author === author) {
            booksbyauthor.push({ "isbn": isbn, "title": books[isbn].title, "reviews": books[isbn].reviews });
        }
    });
    if (booksbyauthor.length > 0) {
        return res.send(JSON.stringify({ booksbyauthor }, null, 4));
    }
    return res.status(404).json({ message: "No books found for this author" });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let booksbytitle = [];
    Object.keys(books).forEach((isbn) => {
        if (books[isbn].title === title) {
            booksbytitle.push({ "isbn": isbn, "author": books[isbn].author, "reviews": books[isbn].reviews });
        }
    });
    if (booksbytitle.length > 0) {
        return res.send(JSON.stringify({ booksbytitle }, null, 4));
    }
    return res.status(404).json({ message: "No books found with this title" });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.send(books[isbn].reviews);
    }
    return res.status(404).json({ message: "Book not found" });
});


// ---------------------------------------------------------------
// Tasks 10-13: the same lookups using Promises / async-await with Axios
// ---------------------------------------------------------------
const BASE_URL = "http://localhost:5000";

// Task 10: Get all books using an async callback function
const getAllBooks = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/`);
        return response.data;
    } catch (error) {
        throw new Error("Error fetching book list: " + error.message);
    }
};

// Task 11: Search by ISBN using Promises
const getBookByISBN = (isbn) => {
    return axios.get(`${BASE_URL}/isbn/${isbn}`)
        .then((response) => response.data)
        .catch((error) => {
            throw new Error("Error fetching book by ISBN: " + error.message);
        });
};

// Task 12: Search by Author using async-await
const getBooksByAuthor = async (author) => {
    try {
        const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
        return response.data;
    } catch (error) {
        throw new Error("Error fetching books by author: " + error.message);
    }
};

// Task 13: Search by Title using async-await
const getBooksByTitle = async (title) => {
    try {
        const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
        return response.data;
    } catch (error) {
        throw new Error("Error fetching books by title: " + error.message);
    }
};

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
