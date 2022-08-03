import Task from "./todo" 

export default class UI {
    static loadPage() {
        UI.initButtons()
        UI.openProject("Inbox-project")


    }

    static initButtons() {
        const taskButton = document.getElementById("task-button");

        taskButton.addEventListener("click", UI.createTask);
    }

    static createTask(name, dueDate) {
        const taskList = document.getElementById("main-tasks");
        

    }

    static createProject(name) {

    }

    static  openProject(name) {

    }


    

}