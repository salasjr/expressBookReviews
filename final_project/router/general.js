const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.query.username;
  const password = req.query.password;
  if (username && password) {
    if (isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).send(JSON.stringify({message: "User successfully registred. Now you can login"}));
    } else {
      return res.status(404).send(JSON.stringify({message: "User already exists!"}));
    }
  } 
  return res.status(404).json({message: "Unable to register user."});

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  filterd_book = books[isbn]
  if(filterd_book){
    return res.status(200).send(JSON.stringify(books[isbn],null,4));

  }
  else{
      return res.status(404).send(JSON.stringify({message: " book not found"}))
  }
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author
  const books_values = Object.values(books);
  const filtered_book = books_values.filter(book=> book.author === author);
  if(filtered_book.length>0){
    return res.status(200).send(JSON.stringify(filtered_book[0],null,4));
  }
  else{
    return res.status(404).send(JSON.stringify({message: " book not found"}))

  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title
  const books_values = Object.values(books);
  const book_filter = books_values.filter(book=> book.title === title);
  if(book_filter.length>0){
    return res.status(200).send(JSON.stringify(book_filter[0],null,4));
  }
  else{
    return res.status(404).send(JSON.stringify({message: " book not found"}))

  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  filterd_book = books[isbn]
  if(filterd_book){
    return res.status(200).send(JSON.stringify({reviews: filterd_book["reviews"]},null,4));

  }
  else{
      return res.status(404).send(JSON.stringify({message: " book not found"}))
  }
});



module.exports.general = public_users;
