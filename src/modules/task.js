//Class of task objects
export default class Task {
    constructor(title, dueDate, finished=false) {
        this.title = title;
        this.dueDate = dueDate;
        finished === false ? this.finished = "" : this.finished = "checked" 
    }

    getName() {
        return this.title;
    }

    setName(title) {
        this.title = title
    }

    getDate() {
        return this.dueDate
    }

    setDate(date) {
        this.dueDate = date
    }

    getFinished() {
        return this.finished
    }

    setFinished(finished) {
        finished === false ? this.finished = "" : this.finished = "checked" 
    }
}