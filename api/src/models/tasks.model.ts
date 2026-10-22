import { Schema, model } from 'mongoose';

export const STATUSES = ['todo', 'doing', 'done'] as const;

const taskSchema = new Schema(
    {
        title: { type: String, required: true, trim: true, maxlength: 200 },
        status: { type: String, enum: STATUSES, default: 'todo', required: true },
        order: { type: Number, required: true, default: 0 },
    },
    {
        timestamps: true,
        toJSON: {
            versionKey: false,
            transform: (_doc, ret: Record<string, unknown>) => {
                ret.id = String(ret._id);
                delete ret._id;
                return ret;
            },
        },
    },
);

taskSchema.index({ status: 1, order: 1 });

export const Task = model('Task', taskSchema);