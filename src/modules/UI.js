import Task from "./task" 
import Project from "./project"
import TodoList from "./todo-list"
import Storage from "./storage"

export default class UI {
    static loadPage() {
        UI.loadProjects()
        UI.initButtons()
        UI.openGeneralProject("Inbox")
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
    
        const projectName = document.getElementById("project-title").textContent 
        if (projectName === "Inbox" || projectName === "Today" ||
              projectName === "This week") {
            UI.addTaskFormProjects()
        }

        const submitButton = document.getElementById("submit-task")
        submitButton.addEventListener("click", UI.addTask)
    }

    static initModifyTask(name, date) {
        const submitButton = document.getElementById("submit-task")
        UI.showTaskForm()
        
        const project = document.getElementById("project-title").textContent 
        if (project === "Inbox" || project === "Today" || project === "This week") {
            submitButton.mainProject = name.split("(")[1].split(")")[0];
            name = name.split(" (")[0]
        }

        document.querySelector("input[name$='title']").value = name
        document.querySelector("input[name$='date']").value = date

        submitButton.previousName = name
        submitButton.addEventListener("click", UI.modifyTask)
    }

    static addTask(name, dueDate, finished) {
        if (dueDate === undefined) { // Values from popup
            let projectName = document.getElementById("project-title").textContent 
            const previousProject = projectName
            name = document.querySelector("input[name$='title']").value
            dueDate = document.querySelector("input[name$='date']").value
            finished = ""

            if (projectName === "Inbox" || projectName === "Today" ||
              projectName === "This week") {
                const select = document.getElementById("form-projects")
                if (select.options.selectedIndex === -1) {
                    alert("You have to create a project first")
                    return
                }
                projectName = select.options[select.selectedIndex].value
            }

            if (name === "") {
                alert("You have to enter a name for the task.");
                return
            }

            Storage.addTask(projectName, new Task(name, dueDate, false)) //New task
            UI.openGeneralProject(previousProject)
            UI.closeTaskModal() 
            
            if (previousProject === "Inbox" || previousProject === "Today" ||
            previousProject === "This week") {
                return
            }
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
        
        if (projectName === "Today" || projectName === "This week" ||
          projectName === "Inbox") {
            const mainProjectName = event.target.mainProject;

            Storage.updateInfoTask(mainProjectName, event.target.previousName, name, dueDate)
            UI.closeTaskModal()
            UI.openProject(mainProjectName)
            UI.openGeneralProject(projectName)
        } else {
            Storage.updateInfoTask(projectName, event.target.previousName, name, dueDate)
            UI.closeTaskModal()
            UI.openProject(projectName)
        }
    }

    static deleteTask(event) {
        const projectName = document.getElementById("project-title").textContent 
        let taskName = event.currentTarget.name;

        if (projectName === "Today" || projectName === "This week" ||
          projectName === "Inbox") {
            const mainProjectName = taskName.split("(")[1].split(")")[0];
            const mainTaskName = taskName.split(" (")[0]
            
            Storage.deleteTask(projectName, taskName)
            Storage.deleteTask(mainProjectName, mainTaskName);
            UI.openProject(mainProjectName)
            UI.openGeneralProject(projectName)
        } else {
            Storage.deleteTask(projectName, taskName)
            UI.openProject(projectName)
        }
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
        let projectName = ""
        if (typeof(event) === "object") projectName = event.currentTarget.name
        else projectName = event

        const projects = Storage.getTodoList().getProjects()
        let tasks = []

        projects.forEach((project) => {
            if (project.getName() !== "Today" &&
                project.getName() !== "This week" &&
                project.getName() !== "Inbox") {
                if (projectName === "Today") {
                    const todayTasks = project.getTodayTasks()
                    todayTasks.forEach(function(task) {
                        task.setName(task.getName() + " (" + project.getName() + ")");
                        tasks.push(task)
                    })
                } else if (projectName === "This week") {
                    const weekTasks = project.getWeekTasks()
                    weekTasks.forEach(function(task) {
                        task.setName(task.getName() + " (" + project.getName() + ")");
                        tasks.push(task)
                    })
                } else {
                    const allTasks = project.getTasks()
                    allTasks.forEach(function(task) {
                        task.setName(task.getName() + " (" + project.getName() + ")");
                        tasks.push(task)
                    })
                }
            }
        })
        Storage.addTasks(`${projectName}`, tasks)
        UI.openProject(`${projectName}`)
    }

    static deleteProject(event) {
        const projectName = event.currentTarget.name 
        console.log(projectName)

        Storage.deleteProject(projectName)
        UI.loadProjects()
        UI.openGeneralProject("Inbox")
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

    static addTaskFormProjects() {
        const taskForm = document.getElementById("task-form")
        const formButtons = document.getElementById("task-form-buttons")
        const label = document.createElement("label")
        const select = document.createElement("select")

        label.for = "project"
        label.textContent = "Project"
        taskForm.insertBefore(label, formButtons)

        const projects = Storage.getTodoList().getProjects()
        projects.forEach(function(project) {
            if (project.getName() !== "Inbox" && project.getName() !== "Today" &&
              project.getName() !== "This week") {
                const option = document.createElement("option")
                option.value = `${project.getName()}`
                option.textContent = `${project.getName()}`
                select.appendChild(option)
            }
        })

        select.id="form-projects"
        taskForm.insertBefore(select, formButtons)
    }
}