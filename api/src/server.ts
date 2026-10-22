import express from 'express'
import mongoose from 'mongoose'
import { Task } from './models/tasks.model.js'
import { tasksRouter } from './routes/tasks.routes.js';

const app = express();

app.use(express.json());


app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
});


app.use('/api/tasks', tasksRouter);



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