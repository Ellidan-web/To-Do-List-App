// DOM Elements
const taskInput = document.querySelector('#taskInput');
const taskDateInput = document.querySelector('#taskDate');
const taskTimeInput = document.querySelector('#taskTime');
const addBtn = document.querySelector('#addBtn');
const taskList = document.querySelector('#taskList');
const filterButtons = document.querySelectorAll('.filter');
const clearCompletedBtn = document.querySelector('#clearCompleted');
const taskCountEl = document.querySelector('#taskCount');
const themeBtn = document.querySelector('#themeBtn');
const calendarDate = document.querySelector('#calendarDate');
const clearDateFilterBtn = document.querySelector('#clearDateFilter');

let tasks = [];
let currentFilter = 'all';
let dragSrcEl = null;
let dateFilter = '';

// Load tasks
loadFromLocalStorage();
renderTasks(currentFilter);

// Reminder check every minute
setInterval(checkReminders, 60000);

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => { if(e.key==='Enter') addTask(); });
filterButtons.forEach(btn => btn.addEventListener('click', () => {
  document.querySelector('.filter.active').classList.remove('active');
  btn.classList.add('active');
  currentFilter = btn.dataset.filter;
  renderTasks(currentFilter);
}));
clearCompletedBtn.addEventListener('click', () => { tasks = tasks.filter(t=>!t.completed); saveToLocalStorage(); renderTasks(currentFilter); });
themeBtn.addEventListener('click', () => { document.body.classList.toggle('dark'); themeBtn.textContent = document.body.classList.contains('dark')?'☀️':'🌙'; });
calendarDate.addEventListener('change', () => { dateFilter = calendarDate.value; renderTasks(currentFilter); });
clearDateFilterBtn.addEventListener('click', () => { dateFilter=''; calendarDate.value=''; renderTasks(currentFilter); });

// Add Task
function addTask() {
  const text = taskInput.value.trim(); if(!text) return;
  const dueDate = taskDateInput.value || '';
  const dueTime = taskTimeInput.value || '';
  tasks.push({ id:Date.now(), text, completed:false, dueDate, dueTime });
  taskInput.value=''; taskDateInput.value=''; taskTimeInput.value=''; taskInput.focus();
  saveToLocalStorage(); renderTasks(currentFilter);
}

// Edit Task
function editTask(id) {
  const task = tasks.find(t=>t.id===id);
  const newText = prompt('Edit task:', task.text);
  const newDate = prompt('Edit due date (YYYY-MM-DD):', task.dueDate);
  const newTime = prompt('Edit time (HH:MM, optional):', task.dueTime);
  if(newText!==null && newText.trim()!==''){ task.text=newText.trim(); task.dueDate=newDate||task.dueDate; task.dueTime=newTime||task.dueTime; saveToLocalStorage(); renderTasks(currentFilter); }
}

// Delete Task
function deleteTask(id) {
  const el=document.getElementById(`task-${id}`);
  if(el){ el.style.opacity=0; el.style.transform='scale(0.95)'; setTimeout(()=>{ tasks=tasks.filter(t=>t.id!==id); saveToLocalStorage(); renderTasks(currentFilter); },300); }
}

// Toggle Complete
function toggleTask(id){ const task=tasks.find(t=>t.id===id); task.completed=!task.completed; saveToLocalStorage(); renderTasks(currentFilter); }

// Render Tasks
function renderTasks(filter){
  taskList.innerHTML='';
  let filteredTasks = tasks;
  if(filter==='active') filteredTasks=tasks.filter(t=>!t.completed);
  if(filter==='completed') filteredTasks=tasks.filter(t=>t.completed);
  if(dateFilter) filteredTasks=filteredTasks.filter(t=>t.dueDate===dateFilter);

  filteredTasks.forEach(task=>{
    const li=document.createElement('li');
    li.className=`task ${task.completed?'completed':''}`;
    li.id=`task-${task.id}`;
    li.draggable=true;

    const datetimeText = task.dueDate ? `${task.dueDate}${task.dueTime ? ' ' + task.dueTime : ''}` : '';
    li.innerHTML=`<span class="text">${task.text}</span> ${datetimeText?`<span class="datetime">${datetimeText}</span>`:''}
                  <div class="task-buttons">
                    <button onclick="toggleTask(${task.id})">✔</button>
                    <button onclick="editTask(${task.id})">✏</button>
                    <button onclick="deleteTask(${task.id})">🗑</button>
                  </div>`;
    taskList.appendChild(li);

    // Drag & Drop
    li.addEventListener('dragstart', e=>{ dragSrcEl=li; li.classList.add('dragging'); e.dataTransfer.effectAllowed='move'; });
    li.addEventListener('dragend', ()=>{ li.classList.remove('dragging'); });
    li.addEventListener('dragover', e=>e.preventDefault());
    li.addEventListener('drop', e=>{
      e.preventDefault();
      if(dragSrcEl!==li){
        const srcIndex=tasks.findIndex(t=>t.id===Number(dragSrcEl.id.split('-')[1]));
        const targetIndex=tasks.findIndex(t=>t.id===Number(li.id.split('-')[1]));
        tasks.splice(targetIndex,0,tasks.splice(srcIndex,1)[0]);
        saveToLocalStorage(); renderTasks(currentFilter);
      }
    });
  });

  updateTaskCount();
}

// Save/Load
function saveToLocalStorage(){ localStorage.setItem('tasks',JSON.stringify(tasks)); }
function loadFromLocalStorage(){ const storedTasks=localStorage.getItem('tasks'); tasks=storedTasks?JSON.parse(storedTasks):[]; }

// Update Task Count
function updateTaskCount(){ const activeCount=tasks.filter(t=>!t.completed).length; taskCountEl.textContent=`${activeCount} active / ${tasks.length} total`; }

// Check reminders
function checkReminders(){
  const now=new Date();
  tasks.forEach(task=>{
    if(task.completed || !task.dueDate) return;
    const taskDateTime = new Date(task.dueDate + 'T' + (task.dueTime || '00:00'));
    const diff = taskDateTime - now;
    if(diff>0 && diff<=5*60*1000 && !task.notified){ // 5 mins before
      alert(`Reminder: "${task.text}" is due at ${task.dueDate} ${task.dueTime || ''}`);
      task.notified=true;
    }
  });
  saveToLocalStorage();
}
