document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todoInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const priorityFilter = document.getElementById('priority-filter');
    const addButton = document.querySelector('.add-btn');
    const deleteAllButton = document.querySelector('.delete-all-btn');
    const todoList = document.getElementById('todoList');
    const pendingTasks = document.getElementById('pending-tasks');
    
    // Generar ids
    let counter = 0;
    const generateUniqueId = () => {
        const id = `${Date.now()}-${counter++}`;
        return id;
    };

    // Array de tareas recuperadas
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';

    // Verificar o crear IDs
    for (let i = 0; i < todos.length; i++) {
        if (!todos[i].id) {
            todos[i].id = generateUniqueId();
        }
    }
    saveTodos();

    function updatePendingTasks() {
        const pendingCount = todos.filter(todo => !todo.completed).length; // No completadas
        pendingTasks.textContent = `Tienes ${pendingCount} tareas pendientes`;
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos)); // Guarda 'todos' en localStorage
        updatePendingTasks(); // Actualizar
    }

    function renderTodos() { // Mostrar tareas
        todoList.innerHTML = '';
        
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        const sortedTodos = [...todos].sort((a, b) => 
            priorityOrder[a.priority] - priorityOrder[b.priority]
        ); // Comparación

        sortedTodos.forEach(todo => {
            if (currentFilter === 'all' || todo.priority === currentFilter) { 
                const li = document.createElement('li');
                li.className = `todo-item priority-${todo.priority} ${todo.completed ? 'completed' : ''}`;
                li.dataset.id = todo.id;
                
                li.innerHTML = `
                    <div class="priority-indicator"></div>
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                    <div class="todo-content">
                        <span class="todo-text">${todo.text}</span>
                    </div>
                    <button class="delete-btn">×</button>
                `;
            
                todoList.appendChild(li);
            }
        });
    }

    function addTodo() { // Nueva tarea a la lista
        const text = todoInput.value.trim(); // Elimina espacios (evita agregar tareas vacias)
        const priority = prioritySelect.value;
        if (text) {
            const newTodo = {
                id: generateUniqueId(),
                text,
                priority,
                completed: false
            };
            todos.push(newTodo); // Agrega tarea al array
            todoInput.value = '';
            saveTodos();
            renderTodos();
        }
    }

    function toggleTodo(id) { // Maneja estados completado
        const todo = todos.find(t => t.id === id); 
        if (todo) {
            todo.completed = !todo.completed;
            saveTodos();
            renderTodos();
        }
    }

    function deleteTodo(id) {
        todos = todos.filter(t => t.id !== id); // Excluye la tarea (id)
        saveTodos();
        renderTodos();
    }

    function deleteAllTodos() {
        todos = [];
        counter = 0; // Reiniciar 
        saveTodos();
        renderTodos();
    }

    todoList.addEventListener('click', (e) => {
        const li = e.target.closest('li'); // elemento más cercano
        if (!li) return;
        
        const id = li.dataset.id;
        
        if (e.target.classList.contains('delete-btn')) {
            deleteTodo(id);
        } else if (e.target.classList.contains('todo-checkbox')) {
            toggleTodo(id);
        }
    });

    addButton.addEventListener('click', addTodo);
    deleteAllButton.addEventListener('click', deleteAllTodos);
    todoInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') addTodo();
    });
    
    priorityFilter.addEventListener('change', (e) => {
        currentFilter = e.target.value;
        renderTodos();
    });

    updatePendingTasks();
    renderTodos();
});