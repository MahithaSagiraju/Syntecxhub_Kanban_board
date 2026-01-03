// Kanban Board JavaScript - Beginner-friendly with comments

// Initialize tasks from localStorage or create empty structure
let tasks = JSON.parse(localStorage.getItem('kanbanTasks')) || {
    todo: [],
    doing: [],
    done: []
};

// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
}

// Function to render all tasks in their columns
function renderTasks() {
    // Clear existing tasks from all columns
    document.querySelectorAll('.task-list').forEach(list => list.innerHTML = '');

    // Loop through each column and render its tasks
    Object.keys(tasks).forEach(column => {
        const taskList = document.querySelector(`[data-column="${column}"]`);
        tasks[column].forEach(task => {
            const taskElement = createTaskElement(task);
            taskList.appendChild(taskElement);
        });
    });
}

// Function to create a task element with all necessary properties
function createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';
    taskDiv.draggable = true;
    taskDiv.dataset.id = task.id;

    taskDiv.innerHTML = `
        <span>${task.text}</span>
        <button class="delete-btn" onclick="deleteTask('${task.id}')">×</button>
    `;

    // Add drag event listeners
    taskDiv.addEventListener('dragstart', handleDragStart);
    taskDiv.addEventListener('dragend', handleDragEnd);

    return taskDiv;
}

// Drag and drop event handlers
function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.id);
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

// Function to handle dropping tasks into columns
function handleDrop(e) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    const newColumn = e.currentTarget.dataset.column;

    // Find the task in the current column and move it
    let taskToMove = null;
    let oldColumn = null;

    for (const column in tasks) {
        const taskIndex = tasks[column].findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            taskToMove = tasks[column][taskIndex];
            oldColumn = column;
            tasks[column].splice(taskIndex, 1);
            break;
        }
    }

    // Add task to new column
    if (taskToMove) {
        tasks[newColumn].push(taskToMove);
        saveTasks();
        renderTasks();
    }
}

// Function to handle drag over (allow drop)
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('over');
}

// Function to handle drag leave
function handleDragLeave(e) {
    e.currentTarget.classList.remove('over');
}

// Function to add a new task
function addTask() {
    const taskText = prompt('Enter task name:');
    if (taskText && taskText.trim()) {
        const newTask = {
            id: Date.now().toString(), // Unique ID using timestamp
            text: taskText.trim()
        };

        // Add to todo column
        tasks.todo.push(newTask);
        saveTasks();
        renderTasks();
    }
}

// Function to delete a task
function deleteTask(taskId) {
    // Find and remove the task from its column
    for (const column in tasks) {
        const taskIndex = tasks[column].findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tasks[column].splice(taskIndex, 1);
            break;
        }
    }

    saveTasks();
    renderTasks();
}

// Initialize the board when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners for columns
    document.querySelectorAll('.task-list').forEach(list => {
        list.addEventListener('drop', handleDrop);
        list.addEventListener('dragover', handleDragOver);
        list.addEventListener('dragleave', handleDragLeave);
    });

    // Set up add task button
    document.getElementById('add-task').addEventListener('click', addTask);

    // Render initial tasks
    renderTasks();
});
