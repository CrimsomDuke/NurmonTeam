import express from 'express';
import path from 'path';
import cors from 'cors';

import { db } from './models/';
import { Container } from './injection/container';
import fileUpload from 'express-fileupload';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(fileUpload())
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));


let corsOptiosn = {
    origin : ['http://localhost:5173', 'http://127.0.0.1:5173'],
}

app.use(cors(corsOptiosn));

db.connect()
    .then(() => {
        console.log("Database connection established successfully.");
    }).catch((err : Error) => {
        console.error("Failed to connect to the database:", err);
        process.exit(1); // Exit the process if database connection fails
    })

const container = Container.getInstance(db);

//routes
require('./routes/')(app, container);

app.get('/', (req, res) => {
    res.send("Hello World con el JavaScript no gay");
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})