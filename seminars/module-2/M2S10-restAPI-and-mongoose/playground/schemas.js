import mongoose from "mongoose";


const authorSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
});

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    isbn: {
        type: String,
        required: true,
        unique: true,
    },
    published: Date,
    author: authorSchema,
    fancyData: {
        type: String,
        validate: {
            validator: (val) => {
                return !val || (val.length > 3 && val.length < 10);
            },
            message: (p) => { return `'${p.value}' should have length between 3 and 10` },
        }
    }
});

export const Book = mongoose.model('otus-books', bookSchema);