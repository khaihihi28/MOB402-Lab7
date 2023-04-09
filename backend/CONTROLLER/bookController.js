const Book = require('../MODELS/book');

const bookController = {
    ///View
    //View All Book
    viewAllBook: async (req, res) => {
        await Book.find({}).then(book => {
            res.render('book/book.handlebars', {
                book: book.map(book => book.toJSON()),
            })
        })
    },
    //View add book
    viewAddBook: async (req, res) => {
        res.render('book/add.handlebars');
    },

    ///CHỨC NĂNG
    addBook: async (req, res) => {
        try {
            const newBook = await new Book({
                isbn: req.body.isbn,
                title: req.body.title,
                author: req.body.author,
                publisher: req.body.publisher,
            })
            const book = await newBook.save();
            res.redirect('/book')
        } catch (err) {
            res.status(401).json(err);
        }
    },
}
module.exports = bookController;