import { LinkedList } from './structs/linked-list.js';
import { BST } from './structs/bst.js';
import { HashTable } from './structs/hash-table.js';
import { binarySearch } from './search/binary-search.js';
import { mergeSortByProperty } from './sort/merge-sort.js';

export class Task {
  constructor(id, title, description, dueDate, priority, tags = []) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = new Date(dueDate);
    this.priority = priority;
    this.tags = tags;
    this.completed = false;
    this.createdAt = new Date();
  }
}

export class TaskManager {
  constructor() {
    this.tasks = new LinkedList();
    this.tasksByDate = new BST();
    this.tasksByTag = new HashTable(50);
    this.nextId = 1;
  }

  addTask(title, description, dueDate, priority, tags = []) {
    const task = new Task(this.nextId++, title, description, dueDate, priority, tags);
    
    this.tasks.add(task);
    this.tasksByDate.insert(task.dueDate.getTime(), task);
    
    tags.forEach(tag => {
      const existingTasks = this.tasksByTag.get(tag) || [];
      existingTasks.push(task);
      this.tasksByTag.set(tag, existingTasks);
    });

    return task;
  }

  removeTask(taskId) {
    const taskArray = this.tasks.toArray();
    const task = taskArray.find(t => t.id === taskId);
    
    if (!task) return false;

    this.tasks.remove(task);
    this.tasksByDate.remove(task.dueDate.getTime());
    
    task.tags.forEach(tag => {
      const tagTasks = this.tasksByTag.get(tag) || [];
      const filtered = tagTasks.filter(t => t.id !== taskId);
      if (filtered.length > 0) {
        this.tasksByTag.set(tag, filtered);
      }
    });

    return true;
  }

  updateTask(taskId, updates) {
    const taskArray = this.tasks.toArray();
    const task = taskArray.find(t => t.id === taskId);
    
    if (!task) return false;

    if (updates.dueDate && updates.dueDate !== task.dueDate) {
      this.tasksByDate.remove(task.dueDate.getTime());
      task.dueDate = new Date(updates.dueDate);
      this.tasksByDate.insert(task.dueDate.getTime(), task);
    }

    Object.assign(task, updates);
    return true;
  }

  getTasksByTag(tag) {
    return this.tasksByTag.get(tag) || [];
  }

  getTasksByDateRange(startDate, endDate) {
    const allTasks = this.tasksByDate.inOrder();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    
    return allTasks
      .filter(item => item.key >= start && item.key <= end)
      .map(item => item.value);
  }

  searchTaskById(taskId) {
    const taskArray = this.tasks.toArray();
    const sortedIds = taskArray.map(t => t.id).sort((a, b) => a - b);
    const index = binarySearch(sortedIds, taskId);
    
    if (index !== -1) {
      return taskArray.find(t => t.id === taskId);
    }
    return null;
  }

  getAllTasksSortedByPriority() {
    const taskArray = this.tasks.toArray();
    return mergeSortByProperty(taskArray, 'priority');
  }

  getAllTasksSortedByDate() {
    const taskArray = this.tasks.toArray();
    return mergeSortByProperty(taskArray, 'dueDate');
  }

  getTaskStats() {
    const taskArray = this.tasks.toArray();
    const completed = taskArray.filter(t => t.completed).length;
    const pending = taskArray.length - completed;
    const overdue = taskArray.filter(t => 
      !t.completed && t.dueDate < new Date()
    ).length;

    return { total: taskArray.length, completed, pending, overdue };
  }

  getAllTasks() {
    return this.tasks.toArray();
  }
}