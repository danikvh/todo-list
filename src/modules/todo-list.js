import Task from "./task"
import Project from "./project"

export default class TodoList {
    constructor() {
        this.projects = []
        this.projects.push(new Project("Inbox"))
        this.projects.push(new Project("Today"))
        this.projects.push(new Project("This week"))
    }
}