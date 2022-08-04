class Project {
    constructor(name) {
        this.name = name;
        this.tasks = [];
    }

    addTask(newTask) {
        if (this.tasks.find((task) => task.getName() === newTask.getName())) return
        else this.tasks.push(newTask)
    }
}