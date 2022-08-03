import Task from "./task" 

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
        UI.showForm()
        document.querySelector("input[name$='date']").value = (new Date().toISOString().substring(0,10))

        const submitButton = document.getElementById("submit-button")
        submitButton.addEventListener("click", UI.addTask)
    }

    static addTask() {
        const title = document.querySelector("input[name$='title']")
        const date = document.querySelector("input[name$='date']")

        const taskList = document.getElementById("main-tasks");
        taskList.innerHTML += `
        <button class="task">
            <div class="task-left">
                <input type="checkbox">
                <p>${title.value}</p>
            </div>
            <p class="date">${date.value}</p>
        </button>`

        UI.closeModal()
    }

    static createProject(name) {

    }

    static  openProject(name) {

    }

    static showForm() {
        let modal = document.getElementById("myModal")
        modal.style.display = "block"
      }

    static closeModal() {
        let modal = document.getElementById("myModal")
        modal.style.display = "none";
      }
    

}