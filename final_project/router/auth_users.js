const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    user = users.filter(user => user.username === username)

    if (user.length > 0){
        return false
    }else{
        return true
    }

}

const authenticatedUser = (username,password)=>{ //returns boolean
    validatedUser = users.filter(user => user.username === username && user.password)

    if (validatedUser.length > 0){
        return true
    }else{
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  const review = req.query.review
  let bookReviewed = books[isbn]
  let username = req.session.authorization["username"]
  bookReviewed["reviews"][username] = review
  return res.status(201).send(JSON.stringify({message: `The review for the book with ISBN ${isbn} has been sussfully added/updated`}, null, 4));
});
regd_users.delete("/auth/review/:isbn", (req, res)=>{
    console.log(req.session.authorization)
    const isbn = req.params.isbn
    let username = req.session.authorization.username
    let bookDel = books[isbn]
    let reviews = bookDel["reviews"]
    delete reviews[username]
    return res.status(201).send(JSON.stringify({message: `review for ISBN ${isbn} by the user test has been deleted`}, null, 4));
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
