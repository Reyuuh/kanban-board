import { Router } from 'express';
import { Task } from '../models/tasks.model.js'

export const tasksRouter = Router();

//GET

tasksRouter.get('/', async (_req, res) => {
    const tasks = await Task.find().sort({ status: 1, order: 1 });
    res.json(tasks);
});

//POST

tasksRouter.post('/', async (req, res) => {
    const status = req.body.status ?? 'todo';


    // find the task with the highest order in the column

    const last = await Task.findOne({ status }).sort({ order: -1 });
    const order = last ? last.order + 1 : 0;

    const task = await Task.create({ title: req.body.title, status, order });
    res.status(201).json(task);

});

//PATCH ändra titlar

tasksRouter.patch('/:id', async (req, res) => {
    const task = await Task.findByIdAndUpdate(
        req.params.id,
        { title: req.body.title },
        { returnDocument: 'after', runValidators: true },
    );
    if (!task) {
        res.status(404).json({ error: 'Uppgiften finns inte' });
        return;
    }
    res.json(task);
});


//DELETE 

tasksRouter.delete('/:id', async (req, res) => {
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) {
        res.status(404).json({ error: 'Uppgiften finns inte' });
        return;
    }
    res.status(204).end();
});