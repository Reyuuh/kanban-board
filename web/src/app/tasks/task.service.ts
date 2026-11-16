import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Task } from './task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
    private http = inject(HttpClient);

    getTasks() {
        return this.http.get<Task[]>('/api/tasks');
    }
}