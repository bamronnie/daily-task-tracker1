document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const dateDisplay = document.getElementById('date');
    const completionDisplay = document.getElementById('completion');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let lastVisit = localStorage.getItem('lastVisit');
    let today = new Date().toLocaleDateString();

    if (lastVisit !== today) {
        tasks.forEach(task => task.completed = false);
        localStorage.setItem('lastVisit', today);
    }

    dateDisplay.textContent = `Date: ${today}`;
    
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.className = task.completed ? 'completed' : '';
            
            const taskText = document.createElement('span');
            taskText.textContent = task.text;
            taskText.addEventListener('click', () => toggleTask(index));
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'x';
            deleteBtn.addEventListener('click', () => deleteTask(index));
            
            taskItem.appendChild(taskText);
            taskItem.appendChild(deleteBtn);
            taskList.appendChild(taskItem);
        });
        updateCompletion();
    }

    function updateCompletion() {
        const completedTasks = tasks.filter(task => task.completed).length;
        const totalTasks = tasks.length;
        const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
        completionDisplay.textContent = `Tasks Completed: ${completionRate}%`;
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push({ text: taskText, completed: false });
            taskInput.value = '';
            updateLocalStorage();
            renderTasks();
        }
    }

    function toggleTask(index) {
        tasks[index].completed = !tasks[index].completed;
        updateLocalStorage();
        renderTasks();
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        updateLocalStorage();
        renderTasks();
    }

    function updateLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    renderTasks();
});
