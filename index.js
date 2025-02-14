const express = require('express');
const bodyParser = require('body-parser');
const fs=require('fs')

const app = express();
app.use(bodyParser.json());


const rawData= fs.readFileSync('data.json')
const books = JSON.parse(rawData);


app.post('/books',(req,res)=>{
  const { book_id, title, author, genre, year, copies } = req.body;

  if (!book_id || !title || !author || !genre || !year || !copies) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  if(books.some(book=>book.book_id===book_id)){
    res.status(500).json({message: "Book already exists!"})
  }

  const newBook = { book_id, title, author, genre, year, copies };
    books.push(newBook);

    fs.writeFileSync('data.json', JSON.stringify(books, null, 2));

    res.status(201).json({ message: "Book added successfully!", book: newBook })


})

app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.book_id == req.params.id);
  if (!book) {
      return res.status(404).json({ message: "Book not found!" });
  }
  res.json(book);
});


app.put('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.book_id == req.params.id);
  if (bookIndex === -1) {
      return res.status(404).json({ message: "Book not found!" });
  }

  
  books[bookIndex] = { ...books[bookIndex], ...req.body };


  fs.writeFileSync('data.json', JSON.stringify(books, null, 2));

  res.json({ message: "Book updated successfully!", book: books[bookIndex] });
});


app.delete('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.book_id == req.params.id);
  if (bookIndex === -1) {
      return res.status(404).json({ message: "Book not found!" });
  }


  books.splice(bookIndex, 1);

 
  fs.writeFileSync('data.json', JSON.stringify(books, null, 2));

  res.json({ message: "Book deleted successfully!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});