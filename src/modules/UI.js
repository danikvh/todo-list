import Task from "./task" 
import Project from "./project"
import TodoList from "./todo-list"
import Storage from "./storage"

export default class UI {
    static loadPage() {
        UI.loadProjects()
        UI.initButtons()
        UI.openProject("Inbox")
    }

    //Initialization
    static loadProjects() {
        Storage.getTodoList().getProjects().forEach((project) => {
            if (project.name !== "Inbox" && project.name !== "Today" &&
                project.name !== "This week") {
                UI.createProject(project.name)
            }
        })
    }

    static initButtons() {
        const taskButton = document.getElementById("task-button");
        const inboxProjectButton = document.getElementById("inbox-project");
        const todayProjectButton = document.getElementById("today-project");
        const weekProjectButton = document.getElementById("week-project");

        taskButton.addEventListener("click", UI.createTask);
        inboxProjectButton.addEventListener("click", UI.openInboxProjects)
        todayProjectButton.addEventListener("click", UI.openTodayProjects)
        weekProjectButton.addEventListener("click", UI.openWeekProjects)
    }


    //Creation of tasks and projects
    static createTask(name, dueDate) {
        UI.showForm()
        document.querySelector("input[name$='date']").value = (new Date().toISOString().substring(0,10))

        const submitButton = document.getElementById("submit-button")
        submitButton.addEventListener("click", UI.addTask)
    }

    static addTask() {
        const title = document.querySelector("input[name$='title']")
        const date = document.querySelector("input[name$='date']")
        const projectName = document.getElementById("project-title").textContent

        Storage.addTask(projectName, new Task(title, date))
        UI.closeModal()

        const taskList = document.getElementById("main-tasks");
        taskList.innerHTML += `
        <button class="task">
            <div class="task-left">
                <input type="checkbox">
                <p>${title.value}</p>
            </div>
            <p class="date">${date.value}</p>
        </button>`
    }

    static createProject(name) {

    }

    static openProject(name) {
        const projectTitle = document.getElementById("project-title")
        projectTitle.textContent = name
    }

    static openInboxProjects() {
        UI.openProject("Inbox")
    }

    static openTodayProjects() {
        UI.openProject("Today")
    }

    static openWeekProjects() {
        UI.openProject("This week")
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