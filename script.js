const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date');
const dueTimeInput = document.getElementById('due-time');
const notesInput = document.getElementById('notes-input');
const taskDisplay = document.getElementById('task-display');
const completionRateDisplay = document.getElementById('completion-rate');
const changeColorButton = document.getElementById('change-color-button');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

taskForm.addEventListener('submit', addTask);

//function: new task
function addTask(e) {
  e.preventDefault();

  const taskText = taskInput.value;
  const dueDate = dueDateInput.value;
  const dueTime = dueTimeInput.value;
  const notes = notesInput.value;

  const task = {
    id: Date.now(),
    text: taskText,
    dueDate: dueDate,
    dueTime: dueTime,
    notes: notes,
    done: false,
    timestamp: getCurrentTimestamp(),
  };

  //Add task to the tasks array
  tasks.push(task);

  //Update task list display
  updateTaskList();

  //Update completion rate display
  updateCompletionRate();

  //Clear the input field
  taskInput.value = '';
  dueDateInput.value = '';
  dueTimeInput.value = '';
  notesInput.value = '';

  //Save tasks to local storage
  saveTasksToLocalStorage();

}

//Function: toggle task done
function toggleTaskDone(id) {
  const task = tasks.find(task => task.id === id);

  //Toggle 'done' status of the task
  task.done = !task.done;

  //Update task list display
  updateTaskList();
  updateCompletionRate();

  saveTasksToLocalStorage();
}

//Function: delete task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);

  updateTaskList();
  updateCompletionRate();
  
  saveTasksToLocalStorage();
}

//Change task, due date, due time
function updateTask(id, newText, newDueDate, newDueTime){
    const task = tasks.find(task => task.id === id);

    task.text = newText;
    task.dueDate = newDueDate;
    task.dueTime = newDueTime;

    updateTaskList();

    saveTasksToLocalStorage();

}

//Function: update task list display
function updateTaskList() {
  //Clear the existing task display
  taskDisplay.innerHTML = '';

  //Generate the task list
  tasks.forEach(task => {
    //New task item
    const taskItem = document.createElement('div');
    taskItem.classList.add('task-item');

    //Checkbox for tasks
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => toggleTaskDone(task.id));

    //Input for task text
    const taskText = document.createElement('input');
    taskText.type = 'text';
    taskText.classList.add('task-text');
    if (task.done) {
      taskText.classList.add('task-done');
    }
    taskText.value = task.text;
    taskText.addEventListener('change', (e) => updateTask(task.id, e.target.value, task.dueDate, task.dueTime));

    //Input for due date
    const dueDate = document.createElement('input');
    dueDate.type = 'date';
    dueDate.classList.add('due-date');
    dueDate.value = task.dueDate;
    dueDate.addEventListener('change', (e) => updateTask(task.id, task.text, e.target.value, task.dueTime));

    //Input for due time
    const dueTime = document.createElement('input');
    dueTime.type = 'time';
    dueTime.classList.add('due-time');
    dueTime.value = task.dueTime;
    dueTime.addEventListener('change', (e) => updateTask(task.id, task.text, task.dueDate, e.target.value));

    //Textarea for task notes
    const notes = document.createElement('textarea');
    notes.placeholder = 'Enter notes...';
    notes.value = task.notes;
    notes.addEventListener('change', (e) => {
      task.notes = e.target.value;
      saveTasksToLocalStorage();
    });

    //Span for task timestamp
    const timestamp = document.createElement('span');
    timestamp.classList.add('task-timestamp');
    timestamp.textContent = formatDate(task.timestamp);

    //Delete button for tasks
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', () => deleteTask(task.id));

    //Append elements to task item
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(dueDate);
    taskItem.appendChild(dueTime);
    taskItem.appendChild(notes);
    taskItem.appendChild(timestamp);
    taskItem.appendChild(deleteButton);

    //Appendtask item to task display
    taskDisplay.appendChild(taskItem);
  });
}

//Function: get current timestamp (millal task lisati)
function getCurrentTimestamp() {
  const now = new Date();
  return now.getTime();
}

//Function: format timestamp
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

//Initial update of task list display
updateTaskList();

//Function update completion rate display
function updateCompletionRate() {
  const completedTasks = tasks.filter(task => task.done).length;
  const totalTasks = tasks.length;
  const completionRatePercentage = (completedTasks / totalTasks) * 100;
  completionRateDisplay.textContent = `Task Completion Rate: ${completionRatePercentage.toFixed(2)}% (${completedTasks} / ${totalTasks})`;
}

//Function: load tasks from local storage and update task list display
function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    updateTaskList();
    updateCompletionRate();
  }
}

//Save tasks to local storage
function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

//Load tasks from local storage
loadTasksFromLocalStorage();

//Save tasks to local storage when the page is unloaded
window.addEventListener('beforeunload', saveTasksToLocalStorage);