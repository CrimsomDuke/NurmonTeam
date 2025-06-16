import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

const containerInst = require('./injection/container');

app.use(express.json());

require('./routes/')(app);

app.get('/', (req, res) => {
    res.send("Hello World con el JavaScript no gay");
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})