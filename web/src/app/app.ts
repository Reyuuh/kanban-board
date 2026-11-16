import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { TaskService } from './tasks/task.service';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private taskService =  inject(TaskService);
   protected readonly tasks = toSignal(this.taskService.getTasks(), { initialValue: [] });
}
