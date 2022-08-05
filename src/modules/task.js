//Class of task objects
export default class Task {
    constructor(title, dueDate) {
        this.title = title;
        this.dueDate = dueDate;
    }

    getName() {
        return this.title;
    }

    getDate() {
        return this.dueDate
    }
}