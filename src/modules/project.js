import { toDate, isToday, isThisWeek, subDays, parseISO } from 'date-fns'

export default class Project {
    constructor(name) {
        this.name = name;
        this.tasks = [];
    }

    getName() {
        return this.name
    }

    setTasks(tasks) {
        this.tasks = tasks
    }

    getTasks() {
        return this.tasks
    }

    getTask(name) {
        return this.tasks.find((task) => task.getName() === name)
    }

    addTask(newTask) {
        if (this.tasks.find((task) => task.getName() === newTask.getName())) return
        else this.tasks.push(newTask)
    }

    deleteTask(taskName) {
        const index = this.tasks.findIndex(i => i.title === taskName)
        this.tasks.splice(index, 1)
    }

    getTodayTasks() {
        return this.tasks.filter((task) => {
            const date = task.getDate()
            return isToday(parseISO(date))
        })
    }

    getWeekTasks() {
        return this.tasks.filter((task) => {
            const date = task.getDate()
            return isThisWeek(subDays(toDate(date), 1))
        })
    }
}