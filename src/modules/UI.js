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

    static initButtons() {
        const taskButton = document.getElementById("task-button");
        const projectButton = document.getElementById("project-create")
        const inboxProjectButton = document.getElementById("inbox-project");
        const todayProjectButton = document.getElementById("today-project");
        const weekProjectButton = document.getElementById("week-project"); 
        const cancelTaskPopupButton = document.getElementById("cancel-task")
        const cancelProjectPopupButton = document.getElementById("cancel-project")

        taskButton.addEventListener("click", UI.createTask);
        projectButton.addEventListener("click", UI.createProject)
        inboxProjectButton.addEventListener("click", UI.openGeneralProject)
        todayProjectButton.addEventListener("click", UI.openGeneralProject)
        weekProjectButton.addEventListener("click", UI.openGeneralProject)
        cancelTaskPopupButton.addEventListener("click", UI.closeTaskModal)
        cancelProjectPopupButton.addEventListener("click", UI.closeProjectModal)
    }


    //CREATION OF TASKS

    static createTask() {
        UI.showTaskForm()
        document.querySelector("input[name$='date']").value = (new Date().toISOString().substring(0,10))
    
        const submitButton = document.getElementById("submit-task")
        submitButton.addEventListener("click", UI.addTask)
    }

    static initModifyTask(name, date) {
        UI.showTaskForm()
        document.querySelector("input[name$='date']").value = date
        document.querySelector("input[name$='title']").value = name

        const submitButton = document.getElementById("submit-task")
        submitButton.previousName = name
        submitButton.addEventListener("click", UI.modifyTask)
    }

    static addTask(name, dueDate, finished) {
        if (dueDate === undefined) { // Values from popup
            const projectName = document.getElementById("project-title").textContent 
            name = document.querySelector("input[name$='title']").value
            dueDate = document.querySelector("input[name$='date']").value
            finished = ""

            if (name === "") {
                alert("You have to enter a name for the task.");
                return
            }

            Storage.addTask(projectName, new Task(name, dueDate, false)) //New task
            UI.closeTaskModal() 
        }

        const taskList = document.getElementById("main-tasks");
        taskList.innerHTML += `
        <div class="task-container">
            <button class="task">
                <div class="task-left">
                    <input type="checkbox" alt="${name}" name="check-finish" ${finished}>
                    <p class="task-title">${name}</p>
                </div>
                <p class="date">${dueDate}</p>
            </button>
            <button class="delete-task-button" name="${name}">
                <img src='./assets/images/cross.svg' alt="${name}" width="10px" height="10px">
            </button>
        </div>`

        UI.initTaskButtons()
    }

    static modifyTask(event) {
        const projectName = document.getElementById("project-title").textContent 
        const name = document.querySelector("input[name$='title']").value
        const dueDate = document.querySelector("input[name$='date']").value
        
        Storage.updateInfoTask(projectName, event.target.previousName, name, dueDate)
        UI.closeTaskModal()
        UI.openProject(projectName)
    }

    static deleteTask(event) {
        const projectName = document.getElementById("project-title").textContent 
        const taskName = event.currentTarget.name;

        Storage.deleteTask(projectName, taskName)
        UI.openProject(projectName)
    }

    static initTaskButtons() {
        const checkBoxes = document.getElementsByName("check-finish")
        const taskButtons = document.querySelectorAll(".task")
        const deleteButtons = document.querySelectorAll(".delete-task-button")

        checkBoxes.forEach((checkBox) => checkBox.addEventListener("click", (event) => {
            const project = document.getElementById("project-title").textContent
            Storage.updateCheckedTask(project, event.target.alt, event.target.checked)
        }))

        taskButtons.forEach((button) => button.addEventListener("click", (event) => {
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

        deleteButtons.forEach((button) => button.addEventListener("click", UI.deleteTask))
    }

    //CREATION OF PROJECTS

    static createProject(event) {
        UI.showProjectForm()
    
        const submitButton = document.getElementById("submit-project")
        submitButton.addEventListener("click", UI.addProject)
    }

    static addProject(name) {
        const nameInput = document.querySelector("input[name$='proj-title']").value
        if (typeof(name) === "object") { // Values from popup
            if (nameInput === "") {
                alert("You have to enter a name for the project.");
                return
            }
            name = nameInput
            Storage.addProject(name)
            UI.closeProjectModal() 
        }
        
        const projectList = document.getElementById("sidebar-projects");
        projectList.insertAdjacentHTML("beforeend", `
        <div class="sidebar-project" id="${name}-project">
            <button class="sidebar-button" id="project" name="${name}">
                <img src='./assets/images/dot.svg' alt="${name}" width="10px" height="10px">
                <p>${name}</p>
            </button>
            <button class="delete-project-button" name="${name}">
                <img src='./assets/images/cross.svg' alt="${name}" width="10px" height="10px">
            </button>
        </div>`)

        UI.initProjectButtons()
    }

    static openProject(name) {
        //Handle button selection        
        if (typeof name !== "string") {
            name = name.currentTarget.name
        }

        const projectTitle = document.getElementById("project-title")
        projectTitle.textContent = name

        //load Tasks
        const taskList = document.getElementById("main-tasks")
        taskList.innerHTML = ""
        const tasks = Storage.getTodoList().getProject(name).getTasks()
        tasks.forEach((task) => UI.addTask(task.getName(), task.getDate(), task.getFinished()))
    }

    static openGeneralProject(event) {
        //To open Inbox, Today or Week tasks
        const projectName = event.currentTarget.name //Today or Week
        const projects = Storage.getTodoList().getProjects()
        let tasks = []

        projects.forEach((project) => {
            if (project.getName() !== "Today" &&
                project.getName() !== "This week" &&
                project.getName() !== "Inbox") {
                if (projectName === "Today") {
                    const todayTasks = project.getTodayTasks()
                    todayTasks.forEach((task) => tasks.push(task))
                } else if (projectName === "This week") {
                    const weekTasks = project.getWeekTasks()
                    weekTasks.forEach((task) => tasks.push(task))
                } else {
                    const allTasks = project.getTasks()
                    allTasks.forEach((task) => tasks.push(task))
                }
            }
        })
        Storage.addTasks(`${projectName}`, tasks)

        console.log(Storage.getTodoList().getProject(`${projectName}`))
        UI.openProject(`${projectName}`)
    }

    static deleteProject(event) {
        const projectName = event.currentTarget.name 
        console.log(projectName)

        Storage.deleteProject(projectName)
        UI.loadProjects()
    }

    static loadProjects() {
        const projectList = document.getElementById("sidebar-projects");
        projectList.innerHTML = ""

        Storage.getTodoList().getProjects().forEach((project) => {
            if (project.getName() !== "Inbox" && project.getName() !== "Today" &&
                project.getName() !== "This week") {
                UI.addProject(project.getName())
            }
        })
    }

    static initProjectButtons() {
        const projectButtons = document.querySelectorAll("#project")
        const deleteButtons = document.querySelectorAll(".delete-project-button")

        projectButtons.forEach((button) => button.addEventListener("click", UI.openProject))        
        deleteButtons.forEach((button) => button.addEventListener("click", UI.deleteProject))
    }

    // POP UP METHODS

    static showTaskForm() {
        let modal = document.getElementById("taskModal")
        modal.style.display = "block"
    }

    static closeTaskModal() {
        let modal = document.getElementById("taskModal")
        modal.style.display = "none";
        document.querySelector("input[name$='title']").value = ""
    }

    static showProjectForm() {
        let modal = document.getElementById("projectModal")
        modal.style.display = "block"
    }

    static closeProjectModal() {
        let modal = document.getElementById("projectModal")
        modal.style.display = "none";
        document.querySelector("input[name$='proj-title']").value = ""
    }
}