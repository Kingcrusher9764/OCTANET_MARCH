const input = document.querySelector("input")
const addButton = document.querySelector(".add__button")
const todoList = document.querySelector(".todo__list")
const deleteAll = document.querySelector(".delete__all")
const filters = document.querySelectorAll(".filter")

let todoJson = JSON.parse(localStorage.getItem("todoList")) || [];

let filter = "";

showTodos()

function getTodoHtml(todo, index) {
    if (filter && filter != todo.status) {
        return "";
    }

    let checked = todo.status == "completed" ? "checked" : "";
    return `
    <li class="todo">
        <label for="${index}">
            <input id="${index}" type="checkbox" onclick="updateStatus(this)" ${checked}>
            <span class="${checked}">${todo.name}</span>
        </label>
        <button class="delete__button" data-index="${index}" onclick="remove(this)" >DELETE</button>
    </li>
    `
}

function showTodos() {
    if (todoJson.length == 0) {
        todoList.innerHTML = "";
    } else {
        todoList.innerHTML = todoJson.map(getTodoHtml).join("");
    }
}

function addTodo(todo) {
    input.value = "";
    todoJson.unshift({ name: todo, status: "pending" });
    localStorage.setItem("todoList", JSON.stringify(todoJson))
    showTodos();
}

input.addEventListener("keyup", e => {
    let todo = input.value.trim();
    if (!todo || e.key != "Enter") {
        return;
    }
    addTodo(todo);
})

addButton.addEventListener("click", () => {
    let todo = input.value.trim();
    if (!todo) {
        return;
    }
    addTodo(todo);
})

function updateStatus(todo) {
    let todoName = todo.parentElement.lastElementChild;
    if (todo.checked) {
        todoName.classList.add("checked");
        todoJson[todo.id].status = "completed";
    } else {
        todoName.classList.remove("checked");
        todoJson[todo.id].status = "pending";
    }
    localStorage.setItem("todoList", JSON.stringify(todoJson));
}

function remove(todo) {
    const index = todo.dataset.index;
    todoJson.splice(index, 1);
    showTodos();
    localStorage.setItem("todoList", JSON.stringify(todoJson));
}

filters.forEach((el) => {
    el.addEventListener("click", (e) => {
        if (el.classList.contains("active")) {
            el.classList.remove("active");
            filter = "";
        } else {
            filters.forEach(tag => tag.classList.remove("active"));
            el.classList.add("active");
            filter = e.target.dataset.filter;
        }
        showTodos();
    })
})

deleteAll.addEventListener("click", () => {
    todoJson = [];
    localStorage.setItem("todoList", JSON.stringify(todoJson));
    showTodos();
})