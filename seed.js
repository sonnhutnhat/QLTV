const Book = require('./models/book.js');
const faker = require('faker');
const category = ["Science", "Biology", "Physics", "Chemistry", "Novel", "Travel", "Cooking", "Philosophy", "Mathematics", "Ethics", "Technology"];

const author = [];
for(let i = 0; i < 11; i++) {
    author.push(faker.name.findName());
}
async function seed(limit) {
    for(let i = 0; i < 11; i++) {
        author.push(faker.name.findName());
    }
    for(let i = 0; i < limit; i++) {
        let random_number = Math.floor(Math.random() * Math.floor(11));
        try {
            const book = new Book({
                title: faker.lorem.words(),
                author: author[random_number],
                category: category[random_number],
                published_at: Date.now() - 100 * 7 * 24 * 60 * 60 * 1000,
                total_book: 100,
                remain_book: 100 - Math.floor(Math.random() * 10),
            });
            await book.save();
        } catch(err) {
            console.log("Error at creating books");
        }
    }
}

module.exports = seed;