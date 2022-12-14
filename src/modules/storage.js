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

        todoList.setProjects(todoList.getProjects().map((project) => 
            Object.assign(new Project(), project)))

        todoList.getProjects().forEach((project) => project.setTasks(
            project.getTasks().map((task) => Object.assign(new Task(), task))))

        return todoList;
    }

    
    //TASK HANDLING

    static addTask(projectName, task) {
        const todoList = Storage.getTodoList()
        todoList.getProject(projectName).addTask(task)
        Storage.saveTodoList(todoList)
    }

    static addTasks(projectName, tasks) {
        const todoList = Storage.getTodoList()
        todoList.getProject(projectName).setTasks(tasks)
        Storage.saveTodoList(todoList)
    }

    static updateCheckedTask(projectName, name, checked) {
        const todoList = Storage.getTodoList()
        const task = todoList.getProject(projectName).getTask(name)
        checked === true ? task.setFinished(true) : task.setFinished(false)
        Storage.saveTodoList(todoList) 
    }

    static updateInfoTask(projectName, previousName, name, date) {
        const todoList = Storage.getTodoList()
        const task = todoList.getProject(projectName).getTask(previousName)
        task.setName(name)
        task.setDate(date)
        Storage.saveTodoList(todoList) 
    }

    static deleteTask(projectName, taskName) {
        const todoList = Storage.getTodoList()
        todoList.getProject(projectName).deleteTask(taskName)
        Storage.saveTodoList(todoList) 
    }

    //PROJECT HANDLING

    static addProject(projectName) {
        const todoList = Storage.getTodoList()
        todoList.addProject(projectName)
        Storage.saveTodoList(todoList)
    }

    static deleteProject(projectName) {
        const todoList = Storage.getTodoList()
        todoList.deleteProject(projectName)
        Storage.saveTodoList(todoList) 
    }
}