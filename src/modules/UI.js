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

    //INITIALIZATION

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
        const cancelPopupButton = document.getElementById("cancel-button") 

        taskButton.addEventListener("click", UI.createTask);
        inboxProjectButton.addEventListener("click", UI.openInboxProjects)
        todayProjectButton.addEventListener("click", UI.openTodayProjects)
        weekProjectButton.addEventListener("click", UI.openWeekProjects)
        cancelPopupButton.addEventListener("click", UI.closeModal)
    }


    //CREATION OF TASKS AND PROJECTS

    static createTask() {
        UI.showForm()
        document.querySelector("input[name$='date']").value = (new Date().toISOString().substring(0,10))
    
        const submitButton = document.getElementById("submit-button")
        submitButton.addEventListener("click", UI.addTask)
    }

    static initModifyTask(name, date) {
        UI.showForm()
        document.querySelector("input[name$='date']").value = date
        document.querySelector("input[name$='title']").value = name

        const submitButton = document.getElementById("submit-button")
        submitButton.previousName = name
        submitButton.addEventListener("click", UI.modifyTask)
    }

    static addTask(name, dueDate, finished) {
        if (dueDate === undefined) { // Values from popup
            const projectName = document.getElementById("project-title").textContent 
            name = document.querySelector("input[name$='title']").value
            dueDate = document.querySelector("input[name$='date']").value
            finished = ""

            Storage.addTask(projectName, new Task(name, dueDate, false)) //New task
            UI.closeModal() 
        }

        const taskList = document.getElementById("main-tasks");
        taskList.innerHTML += `
        <button class="task">
            <div class="task-left">
                <input type="checkbox" alt="${name}" name="check-finish" ${finished}>
                <p class="task-title">${name}</p>
            </div>
            <p class="date">${dueDate}</p>
        </button>`

        UI.initTaskButtons()
    }

    static modifyTask(event) {
        const projectName = document.getElementById("project-title").textContent 
        const name = document.querySelector("input[name$='title']").value
        const dueDate = document.querySelector("input[name$='date']").value
        
        Storage.updateInfoTask(projectName, event.target.previousName, name, dueDate)
        UI.closeModal()
        UI.openProject(projectName)
    }

    static createProject(name) {

    }

    static openProject(name) {
        const projectTitle = document.getElementById("project-title")
        projectTitle.textContent = name

        //load Tasks
        const taskList = document.getElementById("main-tasks")
        taskList.innerHTML = ""
        const tasks = Storage.getTodoList().getProject(name).getTasks()
        tasks.forEach((task) => UI.addTask(task.getName(), task.getDate(), task.getFinished()))
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

    static initTaskButtons() {
        const checkBoxes = document.getElementsByName("check-finish")
        const taskButtons = document.querySelectorAll(".task")

        checkBoxes.forEach((checkBox) => checkBox.addEventListener("click", (event) => {
            const project = document.getElementById("project-title").textContent
            Storage.updateCheckedTask(project, event.target.alt, event.target.checked)
        }))

        taskButtons.forEach((button) => button.addEventListener("click", (event) => {
            console.log(event.target)
            let selected = event.target
            //If elements in the button are selected, go up the button element
            if (event.target.className === "date" || event.target.className === "task-left" ) {
                selected = event.target.parentElement
            }
            if (event.target.className === "task-title") {
                selected = event.target.parentElement.parentElement
            }

            //If the checkbox is pressed, don't run
            if (selected.lastElementChild !== null) { 
                const name = selected.firstElementChild.lastElementChild.textContent
                const date = selected.lastElementChild.textContent
                UI.initModifyTask(name, date)
            }
        }))
    }


    static showForm() {
        let modal = document.getElementById("myModal")
        modal.style.display = "block"
      }

    static closeModal() {
        let modal = document.getElementById("myModal")
        modal.style.display = "none";
        document.querySelector("input[name$='title']").value = ""
      }
    

}