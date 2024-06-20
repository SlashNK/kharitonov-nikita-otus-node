import mongoose from "mongoose";
import { Book } from './schemas.js';

mongoose.connect('mongodb://localhost:27017/otus-js-demo');




const createBooks = async () => {

    const b1 = new Book({ title: 'Чайка', isbn: 'ISBN_2', published: new Date('1878-01-01') });
    //await b1.save(); 

    const b2 = new Book({
        title: 'Преступление и наказание',
        isbn: 'ISBN_3',
        published: new Date('1871-01-01'),
        author: { "firstName": 'Федор', 'lastName': 'Достоевский' }
    });
    //await b2.save();


    const b3 = new Book({
        title: 'Идиот',
        isbn: 'ISBN_4',
        published: new Date('1871-01-01'),
        author: { "firstName": 'Федор', 'lastName': 'Достоевский' }
    });
    //   await b3.save();

    const b4 = new Book({
        title: 'Евгений Онегин',
        isbn: 'ISBN_5',
        published: '1871-01-01',
        author: { "firstName": 'Александр', 'lastName': 'Пушкин' }
    });
    //  await b4.save();

    const b5 = new Book({
        title: 'Евгений Онегин 2',
        isbn: 'ISBN_6',
        published: '1971-01-01',
        author: { "firstName": 'Александр', 'lastName': 'Пушкин' }
    });
    // await b5.save();

    const b6 = new Book({
        title: 'Евгений Онегин 3',
        isbn: 'ISBN_7',
        published: '1971-01-01',
        author: { "firstName": 'Александр', 'lastName': 'Пушкин' },
        fancyData: "12345",
    });
    //await b6.save();

    const b7 = new Book({
        title: 'Евгений Онегин 3',
        isbn: 'ISBN_8',
        published: '1971-01-01',
        author: { "firstName": 'Александр', 'lastName': 'Пушкин' },
        fancyData: "o",
    });
    await b7.save();
};


const readData = async () => {


    console.log(await Book.find({
        $or: [
            { "title": { $regex: 'нак' } },
    
            {
                "published": {
                    $gt: new Date("1920-01-01"),
                    $lt: new Date("2180-01-01")
                }
            }
        ]
    },
        {
            title: 1,
            published: 1,
            isbn: 1
        }).sort({ isbn: -1 }));
}
console.log('mongo');
await readData();
//await createBooks();
