import Task from "./task"
import Project from "./project"
import TodoList from "./todo-list"


// Storage for our todo list
export default class Storage {
    static saveTodoList(data) {
        sessionStorage.setItem("todolist", JSON.stringify(data))
    }

    static getTodoList() {
        const todoList = Object.assign(new TodoList(), 
            JSON.parse(sessionStorage.getItem("todolist")))

        todoList.setProjects(todoList.getProjects().map((project) => 
            Object.assign(new Project(), project)))

        todoList.getProjects().forEach((project) => project.setTasks(
            project.getTasks().map((task) => Object.assign(new Task(), task))))

        return todoList;
    }


    static addTask(projectName, task) {
        const todoList = Storage.getTodoList()
        todoList.getProject(projectName).addTask(task)
        Storage.saveTodoList(todoList)
    }
}