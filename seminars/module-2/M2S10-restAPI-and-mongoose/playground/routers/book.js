import bodyParser from 'body-parser';
import express from 'express';



const books = [];
let idCounter = 0;

export const router = express.Router();
router.use(bodyParser.json());
router.get('/books', (req, res) => {
    res.send(books);
});

router.post('/books', (req, res) => {

    idCounter++;
    books.push({ ...req.body, id: idCounter });


    res.send(idCounter + '');
});

router.post('/books/:id/sendMail', (req, res) => {


    res.send('ok');
});


router.get('/books/:id', (req, res) => {

    const id = parseInt(req.params.id);
    const book = books.find(x => x.id === id);

    if (!book) {
        res.status(404).send(`Book ${id} not found`);
    }
    else {
        res.send(book);
    }
});

router.get('/books/:id/author', (req, res) => {

    const id = parseInt(req.params.id);
    const book = books.find(x => x.id === id);

    if (!book) {
        res.status(404).send(`Book ${id} not found`);
    }
    else {
        res.send(book.author);
    }
});


router.delete('/books/:id', (req, res) => {

    const id = parseInt(req.params.id);
    const book = books.find(x => x.id === id);

    if (!book) {
        res.status(404).send(`Book ${id} not found`);
    }
    else {
        const i = books.indexOf(book);

        books.splice(i, 1);
        res.status(204);
    }
});


router.put('/books/:id', (req, res) => {

    const body = req.body;

    delete body.id;
    const id = parseInt(req.params.id);
    const book = books.find(x => x.id === id);

    if (!book) {
        res.status(404).send(`Book ${id} not found`);
    }
    else {

        const i = books.indexOf(book);

        books[i] = { ...book, ...body };
        res.status(200);
    }
});



