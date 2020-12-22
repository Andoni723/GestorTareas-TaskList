import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Task } from '../../services/tasks/model/task';

import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskControllerService } from 'src/app/services/tasks/';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  @ViewChild('dialog', {static: false})
  public dialog: TemplateRef<any>;
  taskStatusOpts = ['Completada', 'En proceso', 'Pendiente'];

  tasks: Task[];

  newTaskData = {
    show: false,
    control: new FormControl('')
  };

  deleteTaskData = {
    index: null,
    dialog: null
  };
  
  constructor(private taskService: TaskControllerService, private matDialog: MatDialog, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.tasks = [];
    this.getTasks();
    // for (let i = 0; i < 10; i++) {
    //   this.tasks.push({ id: i, description: 'Description of Task ' + i, status: this.taskStatusOpts[(i%3)].value});
    // }

  }

  public newTask() {
    this.newTaskData.show = true;
    this.newTaskData.control.setValue('');
  }

  public createTask() {
    const newTask = {
      id: this.tasks.length + 1,
      description: this.newTaskData.control.value,
      status: 'Pendiente',
    }
    console.log('Creating task', newTask);
    //TODO: Add task
    this.newTaskData.show = false;
    this.newTaskData.control.setValue('');
    this.tasks.push(newTask);
    this.taskService.insert(this.tasks[length - 1]).subscribe(data => {
        console.log(data);
        this.getTasks();
      });
    console.log('Tarea creada con exito');
  }

  public cancelNewTask() {
    this.newTaskData.show = false;
    this.newTaskData.control.setValue('');
  }

  public updateTask(idx) {
    const taskToUpdate = this.tasks[idx];
    if (taskToUpdate) {
      console.log('Updating task', taskToUpdate);
      this.taskService.update(taskToUpdate).subscribe(data => {
        console.log(data);
        this.getTasks();
      });
    }
  }

  public deleteTask(idx) {
    this.deleteTaskData.index = idx;
    console.log('Borrar tarea con id', this.tasks[idx].id.toString())
    this.taskService._delete(this.tasks[idx].id.toString()).subscribe(data => {
      console.log(data);
      this.getTasks();
    })
    console.log('Tarea con id', this.tasks[idx].id.toString(), 'borrada.')
  }

  private getTasks() {
    this.taskService.allTasks().subscribe((data: Task[]) => {
      console.log(data);
      this.tasks = data;
    })
  }

}
