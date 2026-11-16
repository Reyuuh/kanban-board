import cors from 'cors'
import helmet from 'helmet'
import type {ErrorRequestHandler} from 'express'
import express from 'express'
import mongoose from 'mongoose'
import { tasksRouter } from './routes/tasks.routes.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:4200'}));

app.use(express.json());


app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
});


app.use('/api/tasks', tasksRouter);

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof mongoose.Error.CastError) {
        res.status(400).json({ error: 'Ogiltigt id'});
        return;
    }
    if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).json({ error: err.message })
        return;
    }
    if (err.status === 400) {
        res.status(400).json({ error: 'Ogiltig JSON'});
        return;
    }
    console.error(err);
    res.status(500).json({error: 'Något gick fel på servern'})

}

app.use(errorHandler);





const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('MONGODB_URI saknas. Finns .env-filen i api-mappen?');
    process.exit(1);
}

await mongoose.connect(uri);
console.log('Ansluten till MongoDb');

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
    console.log(`API lyssnar på http://localhost:${port}`);
});