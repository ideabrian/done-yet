// Get DOM elements
const timerEl = document.getElementById("timer");
const taskInputEl = document.getElementById("task-input");
const addTaskBtnEl = document.getElementById("add-task");
const taskListEl = document.getElementById("task-list");

// Define variables
let timerIntervalId;
let startTime;
let elapsedTime = 0;
let tasks = [];

// Load tasks from local storage
loadTasks();

// Add event listeners
addTaskBtnEl.addEventListener("click", addTask);
taskInputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

// Render tasks
renderTasks();

// Update timer every millisecond
setInterval(() => {
  if (startTime) {
    elapsedTime = Date.now() - startTime;
    timerEl.textContent = formatTime(elapsedTime);
  }
}, 1);

// Add a new task to the list
function addTask() {
  const task = taskInputEl.value.trim();
  if (!task) return;
  tasks.push({ name: task, completed: false, time: "" });
  saveTasks();
  taskInputEl.value = "";
  renderTasks();
}

// Render the task list
function renderTasks() {
  taskListEl.innerHTML = "";
  tasks.slice().reverse().forEach((task, index) => {
    const taskEl = document.createElement("div");
    taskEl.classList.add("flex", "items-center", "justify-between", "py-2", "px-4", "mb-2", "bg-white", "dark:bg-gray-700", "rounded-lg", "shadow");
    taskEl.innerHTML = `
      <div class="flex-1 ${task.completed ? "line-through" : ""}" onclick="editTask(${index})">${task.name} <span class="text-gray-500">${task.time}</span></div>
      <div>
        <button class="text-green-500 hover:text-green-600 mr-2" onclick="toggleTimer(${index})">${timerIntervalId ? "Pause" : "Start"}</button>
        <button class="text-red-500 hover:text-red-600" onclick="completeTask(${index})">Done</button>
      </div>
    `;
    taskListEl.appendChild(taskEl);
  });
}

// Edit an existing task
function editTask(index) {
  const task = tasks[index];
  const newName = window.prompt("Edit task:", task.name);
  if (!newName || newName === task.name) return;
  task.name = newName.trim();
  saveTasks();
  renderTasks();
}

// Start or pause the timer for a task
function toggleTimer(index) {
  const task = tasks[index];
  task.completed = false;
  saveTasks();
  if (timerIntervalId) {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
  } else {
    startTime = Date.now() - elapsedTime;
    timerIntervalId = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      timerEl.textContent = formatTime(elapsedTime);
    }, 1);
  }
  renderTasks();
}

// Complete a task
function completeTask(index) {
  if (!timerIntervalId) return;
  clearInterval(timerIntervalId);
  timerIntervalId = null;
  const task = tasks[index];
  task.completed = true;
  task.time = formatTime(elapsedTime);
  elapsedTime = 0;
  startTime = null;
  saveTasks();
  renderTasks();
  confetti();
}

// Format elapsed time as HH:MM:SS.mmm
function formatTime(elapsedTime) {
  const hours = Math.floor(elapsedTime / 3600000).toString().padStart(2, "0");
  const minutes = Math.floor((elapsedTime % 3600000) / 60000).toString().padStart(2, "0");
  const seconds = Math.floor((elapsedTime % 60000) / 1000).toString().padStart(2, "0");
  const milliseconds = (elapsedTime % 1000).toString().padStart(3, "0");
  return `${hours}:${minutes}:${seconds}`;
}

// Save tasks to local storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks() {
  const tasksJson = localStorage.getItem("tasks");
  if (tasksJson) {
    tasks = JSON.parse(tasksJson);
  }
}

// Throw confetti
function confetti() {
  const confettiCanvas = document.createElement("canvas");
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  document.body.appendChild(confettiCanvas);
  const confettiContext = confettiCanvas.getContext("2d");
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * confettiCanvas.width;
    const y = Math.random() * confettiCanvas.height;
    const size = Math.random() * 10 + 5;
    confettiContext.fillStyle = `hsl(${Math.random() * 360}, 50%, 50%)`;
    confettiContext.fillRect(x, y, size, size);
  }
  setTimeout(() => {
    document.body.removeChild(confettiCanvas);
  }, 2000);
}
