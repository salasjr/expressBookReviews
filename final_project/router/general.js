const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let axios = require("axios")
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

BooksPromise = new Promise((resolve, reject)=>{
    setTimeout(()=>{
        resolve(books)
    }, 2000)
})

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    let list_of_books
    await BooksPromise.then((data)=>{
        list_of_books = data
    })
    return res.status(200).send(JSON.stringify({"books":list_of_books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res) => {
  const isbn = req.params.isbn;
  let list_of_books;
  await BooksPromise.then((data)=>{
      list_of_books = data
  })
  console.log(list_of_books)
  filterd_book = list_of_books[isbn]
  if(filterd_book){
    return res.status(200).send(JSON.stringify(filterd_book,null,4));

  }
  else{
      return res.status(404).send(JSON.stringify({message: " book not found"}))
  }
  
 });
  
// Get book details based on author
public_users.get('/author/:author',async (req, res) =>{
  //Write your code here
  const author = req.params.author
  let list_of_books
  await BooksPromise.then((data)=>{
    list_of_books = data
    })
  const books_values = Object.entries(list_of_books);
  result=[]
  books_values.forEach((book)=>{
      book[1] = Object.assign({"isbn": book[0]}, book[1]);
      result.push(book[1])
  })
  const filtered_book = result.filter(book=> book.author === author);
  filtered_book.forEach((book)=>{
      delete book["author"]
  })
  if(filtered_book.length>0){
    return res.status(200).send(JSON.stringify({"book by author":filtered_book},null,4));
  }
  else{
    return res.status(404).send(JSON.stringify({message: " book not found"}))

  }
});

// Get all books based on title
public_users.get('/title/:title',async (req, res) => {
  //Write your code here
  const title = req.params.title
  let list_of_books
  await BooksPromise.then((data)=>{
    list_of_books = data
  })
  const books_values = Object.entries(list_of_books);
  result=[]
  books_values.forEach((book)=>{
      book[1] = Object.assign({"isbn": book[0]}, book[1]);
      result.push(book[1])
  })
  const book_filter = result.filter(book=> book.title === title);
  book_filter.forEach((book)=>{
    delete book["title"]
})
  if(book_filter.length>0){
    return res.status(200).send(JSON.stringify({"booksbytitle":book_filter},null,4));
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
    return res.status(200).send(JSON.stringify(filterd_book["reviews"],null,4));

  }
  else{
      return res.status(404).send(JSON.stringify({message: " book not found"}))
  }
});



module.exports.general = public_users;
