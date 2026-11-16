export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Task {
    id:string;
    title: string;
    status: TaskStatus;
    order: number;
    createdAt: string;
    updatedAt: string;
}

