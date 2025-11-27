import { TaskManager } from './task-manager.js';

class TaskApp {
  constructor() {
    this.taskManager = new TaskManager();
    this.currentView = 'all';
    this.initializeEventListeners();
    this.loadSampleData();
    this.updateDisplay();
  }

  initializeEventListeners() {
    document.getElementById('addTaskBtn').addEventListener('click', () => this.showTaskForm());
    document.getElementById('saveTaskBtn').addEventListener('click', () => this.saveTask());
    document.getElementById('cancelTaskBtn').addEventListener('click', () => this.hideTaskForm());
    document.getElementById('sortByPriorityBtn').addEventListener('click', () => this.sortByPriority());
    document.getElementById('sortByDateBtn').addEventListener('click', () => this.sortByDate());
    document.getElementById('searchBtn').addEventListener('click', () => this.performSearch());
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.performSearch();
    });
  }

  showTaskForm() {
    document.getElementById('taskForm').style.display = 'block';
    document.getElementById('taskTitle').focus();
  }

  hideTaskForm() {
    document.getElementById('taskForm').style.display = 'none';
    this.clearForm();
  }

  clearForm() {
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskDueDate').value = '';
    document.getElementById('taskPriority').value = '1';
    document.getElementById('taskTags').value = '';
  }

  saveTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const dueDate = document.getElementById('taskDueDate').value;
    const priority = parseInt(document.getElementById('taskPriority').value);
    const tagsInput = document.getElementById('taskTags').value.trim();
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()) : [];

    if (!title || !dueDate) {
      alert('Título e data de vencimento são obrigatórios!');
      return;
    }

    this.taskManager.addTask(title, description, dueDate, priority, tags);
    this.hideTaskForm();
    this.updateDisplay();
  }

  sortByPriority() {
    this.currentView = 'priority';
    this.updateDisplay();
  }

  sortByDate() {
    this.currentView = 'date';
    this.updateDisplay();
  }

  performSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    if (!searchTerm) {
      this.currentView = 'all';
      this.updateDisplay();
      return;
    }

    let results = [];
    
    // Busca por ID
    if (!isNaN(searchTerm)) {
      const task = this.taskManager.searchTaskById(parseInt(searchTerm));
      if (task) results.push(task);
    }
    
    // Busca por tag
    const tagResults = this.taskManager.getTasksByTag(searchTerm);
    results = results.concat(tagResults);

    // Remove duplicatas
    results = results.filter((task, index, self) => 
      index === self.findIndex(t => t.id === task.id)
    );

    this.displayTasks(results);
    this.updateStats();
  }

  updateDisplay() {
    let tasks = [];
    
    switch (this.currentView) {
      case 'priority':
        tasks = this.taskManager.getAllTasksSortedByPriority();
        break;
      case 'date':
        tasks = this.taskManager.getAllTasksSortedByDate();
        break;
      default:
        tasks = this.taskManager.getAllTasks();
    }

    this.displayTasks(tasks);
    this.updateStats();
  }

  displayTasks(tasks) {
    const tasksList = document.getElementById('tasksList');
    
    if (tasks.length === 0) {
      tasksList.innerHTML = '<div class="no-tasks">Nenhuma tarefa encontrada</div>';
      return;
    }

    tasksList.innerHTML = tasks.map(task => this.createTaskHTML(task)).join('');
    
    // Adicionar event listeners para os botões das tarefas
    tasks.forEach(task => {
      const completeBtn = document.getElementById(`complete-${task.id}`);
      const deleteBtn = document.getElementById(`delete-${task.id}`);
      
      if (completeBtn) {
        completeBtn.addEventListener('click', () => this.toggleTaskComplete(task.id));
      }
      
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
      }
    });
  }

  createTaskHTML(task) {
    const isOverdue = !task.completed && task.dueDate < new Date();
    const priorityText = ['', 'Baixa', 'Média', 'Alta'][task.priority];
    
    return `
      <div class="task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}">
        <div class="task-header">
          <span class="task-title">${task.title}</span>
          <span class="task-priority priority-${task.priority}">${priorityText}</span>
        </div>
        <div class="task-description">${task.description}</div>
        <div class="task-meta">
          <div>
            <strong>Vencimento:</strong> ${task.dueDate.toLocaleDateString('pt-BR')}
            ${task.tags.length > 0 ? `
              <div class="task-tags">
                ${task.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
              </div>
            ` : ''}
          </div>
          <div class="task-actions">
            <button id="complete-${task.id}" class="btn btn-small btn-success">
              ${task.completed ? 'Reabrir' : 'Concluir'}
            </button>
            <button id="delete-${task.id}" class="btn btn-small btn-danger">Excluir</button>
          </div>
        </div>
      </div>
    `;
  }

  toggleTaskComplete(taskId) {
    const task = this.taskManager.searchTaskById(taskId);
    if (task) {
      this.taskManager.updateTask(taskId, { completed: !task.completed });
      this.updateDisplay();
    }
  }

  deleteTask(taskId) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.taskManager.removeTask(taskId);
      this.updateDisplay();
    }
  }

  updateStats() {
    const stats = this.taskManager.getTaskStats();
    const statsDiv = document.getElementById('stats');
    
    statsDiv.innerHTML = `
      <div class="stat-item">Total: ${stats.total}</div>
      <div class="stat-item">Pendentes: ${stats.pending}</div>
      <div class="stat-item">Concluídas: ${stats.completed}</div>
      <div class="stat-item">Atrasadas: ${stats.overdue}</div>
    `;
  }

  loadSampleData() {
    // Dados de exemplo para demonstração
    this.taskManager.addTask(
      'Estudar algoritmos de ordenação',
      'Revisar MergeSort e QuickSort para a prova',
      '2024-12-15',
      3,
      ['estudo', 'algoritmos']
    );
    
    this.taskManager.addTask(
      'Implementar BST',
      'Finalizar a implementação da árvore binária de busca',
      '2024-12-10',
      2,
      ['programação', 'estruturas']
    );
    
    this.taskManager.addTask(
      'Preparar apresentação',
      'Criar slides para apresentação do projeto',
      '2024-12-11',
      3,
      ['apresentação', 'projeto']
    );
  }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  new TaskApp();
});