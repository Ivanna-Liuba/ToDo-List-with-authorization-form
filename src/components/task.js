
import { api } from "./api"

export let tasksWrapperElem = document.getElementById('tasks__wrapper')

export class Task {
    constructor(options) {
        const {name, description, _id, timeTracked, createdAt = new Date(), isActive, isFinished } = options
       
        this.name = name;
        this.description = description;
        this.timeTracked = timeTracked;
        this.createdAt = createdAt;
        this.id = _id
        this.isActive = isActive
        this.isFinished = isFinished
        
        this.taskElem = document.createElement('div')
        this.timerElem = document.createElement('p')
        this.playElem = document.createElement('button')
        this.markBtn = document.createElement('button')
        this.deleteBtn = document.createElement('button')
    }

    removeTask = async () => {
        await api.deleteTask(this.id)
        this.taskElem.remove()
    }

    toggleTaskFinished = async () =>  {
        this.isFinished = !this.isFinished

        await api.editTask(this.id, {
            isActive: false,
            isFinished: this.isFinished,
            timeTracked: 0
        })

        if (this.isFinished) {
            this.taskElem.classList.add('done')
            this.markBtn.classList.remove('task__btn-mark')
            this.markBtn.classList.add('task__btn-done')
            this.markBtn.innerText = 'Restart'

            this.stopTracker()
            this.playElem.setAttribute("disabled", "") 
        } else {
            this.taskElem.classList.remove('done')
            this.markBtn.classList.add('task__btn-mark')
            this.markBtn.classList.remove('task__btn-done')
            this.markBtn.innerText = 'Mark as done';
            
            this.playElem.removeAttribute("disabled") 
        }
    }

    toggleTimeTracker = async () => {
        this.isActive = !this.isActive

        const res = await api.editTask(this.id, {isActive: this.isActive})

        if(this.isActive) {
            this.startTracker()
        } else {
            this.stopTracker()
        }
    }

    startTracker() {
        if(!this.intervalId) {
            this.intervalId = setInterval(() => {
                this.timeTracked += 1000
                this.updateTimeTracker()

            }, 1000) 
        }

        this.playElem.innerText = "| |"
        this.playElem.classList.add('pause')
    }

    stopTracker() {
        clearInterval(this.intervalId)
        this.intervalId = null

        this.playElem.innerText = ">"
        this.playElem.classList.remove('pause')
    }

    updateTimeTracker() {
        const formatted = Task.getFormattedTimeTracked(this.timeTracked)
        this.timerElem.innerText = formatted
    }

    static getFormattedDate(data) {
        const unformatedData = new Date(data)
        const date = unformatedData.toLocaleDateString()
        const time = unformatedData.toLocaleTimeString()

        return `${date} ${time}`
    }

    static addOptionalZero(num) {
        return num > 9 ? num : `0${num}`
    }

    static getFormattedTimeTracked(time) {
        const timeTracked = Math.floor(time / 1000)
        let hour = Math.floor(timeTracked / 3600);
        let minute = Math.floor((timeTracked - (hour * 3600)) / 60);
        let sec = timeTracked - (hour * 3600) - (minute * 60)

        let days = null
        if (hour > 23) {
            days = Math.floor(hour / 24);
            hour -= (days * 24)
        }

        let text = `${Task.addOptionalZero(hour)}:${Task.addOptionalZero(minute)}:${Task.addOptionalZero(sec)}`;

        if (days) {
            text = `Дней: ${days}.   Время: ${text}`
        }

        return text
    }

    createTaskCard(container) {
        const titleElem = document.createElement('p')
        const descriptionElem = document.createElement('p')
        const trackerElem = document.createElement('div')
        const dayElem = document.createElement('p')

        titleElem.innerText = this.name;
        descriptionElem.innerText = this.description;
        this.playElem.innerText = ">"
        this.markBtn.innerText = 'Mark as done';
        this.deleteBtn.innerText = 'x'
        dayElem.innerText = Task.getFormattedDate(this.createdAt)
        this.timerElem.innerText = Task.getFormattedTimeTracked(this.timeTracked)
        
        this.taskElem.classList.add('task__card')
        titleElem.classList.add('task__card-title')
        trackerElem.classList.add('task__tracker')
        this.playElem.classList.add('task__btn-play')
        this.markBtn.classList.add('task__btn')
        this.deleteBtn.classList.add('task__btn-delete')

        if (this.isFinished) {
            this.taskElem.classList.add('done')
            this.markBtn.classList.add('task__btn-done')
            this.markBtn.innerText = 'Restart'
            this.playElem.setAttribute("disabled", "")
        } else {
            this.markBtn.classList.add('task__btn-mark')
            this.markBtn.innerText = 'Mark as done'; 
        }

        if(this.isActive) {
            this.playElem.innerText = "| |"
            this.playElem.classList.add('pause')
            this.startTracker()
        } else {
            this.playElem.innerText = ">"
        }

        this.deleteBtn.addEventListener('click', this.removeTask)
        this.playElem.addEventListener('click', this.toggleTimeTracker)
        this.markBtn.addEventListener('click', this.toggleTaskFinished)
        
        trackerElem.append(this.playElem, this.timerElem)
        this.taskElem.append(titleElem, descriptionElem, trackerElem, dayElem, this.markBtn, this.deleteBtn)

        container.append(this.taskElem)
    }
    
}