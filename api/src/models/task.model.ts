import {Schema, model} from 'mongoose';

export const STATUSES = ['todo','doing','done'] as const;

const taskSchema = new Schema(
    {

    },
    {
        timestamps:true,
        toJSON: {
            versionKey: false,
            transform:(_doc, ret: Record<string, unknown>) => {
                ret.id = String(ret._id);
                delete ret._id;
                return ret;
            },
        },
    },
);

taskSchema.index({ status:1, order: 1});

export const Task = model('Task', taskSchema);