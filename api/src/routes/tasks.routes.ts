import { Router } from 'express';
import { Task, STATUSES } from '../models/tasks.model.js'

export const tasksRouter = Router();

//GET

tasksRouter.get('/', async (_req, res) => {
    const tasks = await Task.find().sort({ status: 1, order: 1 });
    res.json(tasks);
});

//POST

tasksRouter.post('/', async (req, res) => {
    const status = req.body?.status ?? 'todo';


    // find the task with the highest order in the column

    const last = await Task.findOne({ status }).sort({ order: -1 });
    const order = last ? last.order + 1 : 0;

    const task = await Task.create({ title: req.body?.title, status, order });
    res.status(201).json(task);

});

//PATCH ändra titlar

tasksRouter.patch('/:id', async (req, res) => {
   
    if(typeof req.body?.title !== 'string') {
        res.status(400).json({ error: 'title krävs'});
        return;
    }

    const task = await Task.findByIdAndUpdate(
        req.params.id,
        { title: req.body?.title },
        { returnDocument: 'after', runValidators: true },
    );

    if (!task) {
        res.status(404).json({ error: 'Uppgiften finns inte' });
        return;
    }
    res.json(task);
});

//PATCH flytta en uppgift (drag and drop)

tasksRouter.patch('/:id/move', async (req, res) => {
    const { status, order } = req.body ?? {};
    
    if (!(STATUSES as readonly string[]).includes(status) || !Number.isInteger(order) || order < 0 ) {
        res.status(400).json({ error: 'status och order (heltal >= 0 krävs)' });
        return;
    }

    const task = await Task.findById(req.params.id);
    if(!task) {
        res.status(404).json({ error: 'Uppgiften finns inte'})
        return;
    }

    // 1. Close the gap in the old column
    await Task.updateMany(
        { status: task.status, order: {$gt: task.order } },
        { $inc: {order: -1 } },
    );

    // 2. Don't allow a position past the end of the new column
    const count = await Task.countDocuments({ status, _id: { $ne: task._id } });
    const newOrder = Math.min(order, count);

    // 3. Make room in the new column
    await Task.updateMany(
        { status, order: { $gte: newOrder }, _id: { $ne: task._id } },
        { $inc: { order: 1} },
    );

    // 4. Put the task in its new place
    task.status = status;
    task.order =  newOrder;
    await task.save();

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