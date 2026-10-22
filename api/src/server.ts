import express from 'express'
import mongoose from 'mongoose'
import {Task} from './models/task.model.js'

const app = express();

app.use(express.json());

//routes

app.get('/api/health', (_req , res) => {
    res.json({ok: true});
});


app.get ('/api/tasks', async (_req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});


const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('MONGODB_URI saknas. Finns .env-filen i api-mappen?');
    process.exit(1);
}

await mongoose.connect(uri);
console.log('Ansluten till MongoDb');

app.listen(3000, () => {
    console.log('API lyssnar på http://localhost:3000');
});