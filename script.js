(function () {
  const STORAGE_KEY = 'todo-app.tasks';

  function getTasks() {
    try {
      const storedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(storedTasks) ? storedTasks : [];
    } catch (error) {
      return [];
    }
  }

  function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function renderTasks() {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;

    const tasks = getTasks();
    taskList.innerHTML = '';

    tasks.forEach(function (task) {
      const li = document.createElement('li');
      li.className = 'task-item' + (task.completed ? ' completed' : '');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = !!task.completed;
      checkbox.setAttribute('aria-label', 'Mark task as complete');
      checkbox.addEventListener('change', function () {
        const currentTasks = getTasks();
        const taskIndex = currentTasks.findIndex(function (item) {
          return item.id === task.id;
        });

        if (taskIndex !== -1) {
          currentTasks[taskIndex].completed = checkbox.checked;
          saveTasks(currentTasks);
          renderTasks();
        }
      });

      const text = document.createElement('span');
      text.className = 'task-text';
      text.textContent = task.text;

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'delete-btn';
      deleteButton.dataset.id = String(task.id);
      deleteButton.textContent = '❌';
      deleteButton.setAttribute('aria-label', 'Delete task');
      deleteButton.addEventListener('click', function () {
        const currentTasks = getTasks();
        const filteredTasks = currentTasks.filter(function (item) {
          return item.id !== task.id;
        });

        saveTasks(filteredTasks);
        renderTasks();
      });

      li.appendChild(checkbox);
      li.appendChild(text);
      li.appendChild(deleteButton);
      taskList.appendChild(li);
    });
  }

  function addTask() {
    const input = document.getElementById('taskInput');
    if (!input) return;

    const text = input.value.trim();
    if (!text) {
      alert('Task ezhuthunga first!');
      return;
    }

    const tasks = getTasks();
    tasks.push({
      id: Date.now() + Math.random(),
      text: text,
      completed: false
    });

    saveTasks(tasks);
    input.value = '';
    renderTasks();
  }

  function initialize() {
    const addButton = document.getElementById('addTaskButton');
    const input = document.getElementById('taskInput');

    if (addButton) {
      addButton.addEventListener('click', addTask);
    }

    if (input) {
      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          addTask();
        }
      });
    }

    renderTasks();
  }

  document.addEventListener('DOMContentLoaded', initialize);

  window.addTask = addTask;
  window.deleteTask = function (button) {
    if (!button) return;

    const taskId = button.dataset && button.dataset.id ? button.dataset.id : null;

    if (taskId) {
      const tasks = getTasks().filter(function (task) {
        return String(task.id) !== String(taskId);
      });

      saveTasks(tasks);
      renderTasks();
      return;
    }

    if (button.parentElement) {
      button.parentElement.remove();
    }
  };
})();