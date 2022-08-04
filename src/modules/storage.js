import Task from "./task"
import Project from "./project"
import TodoList from "./todo-list"


// Storage for our todo list
export default class Storage {
    static saveTodoList(data) {
        localStorage.setItem("todolist", JSON.stringify(data))
    }

    static getTodoList() {
        const todoList = Object.assign(new TodoList(), 
            JSON.parse(localStorage.getItem("todolist")))
    }
}