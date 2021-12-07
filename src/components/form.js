import {  api } from "./api.js"
import { Task, tasksWrapperElem } from "./task.js";
import { clearFormInputs } from "./input.js"

const validaionRules = {
    name: [
        {
        validator: (value) => Boolean(value),
        errorMassage: "You need to wright NAME into this input"
        },
    ],
    email: [
        {
        validator: (value) => Boolean(value),
        errorMassage: "You need to wright EMAIL into this input"
        },
    ],
    password: [
        {
        validator: (value) => Boolean(value.length >= 6),
        errorMassage: "You need to wright at least 6 symbols into this input"
        },
        {
        validator: (value) => Boolean(value),
        errorMassage: "You need to wright PASSWORD into this input"
        },
    ],
}

const validateForm = (values, rules) => {
    const errors = {}
    let isFormValid = true;

    for (let name in values) {
        const value = values[name]
        const currentRule = rules[name]
        if(!currentRule) {
            break
        }
        currentRule.forEach(rule => {
            const isValid = rule.validator(value)

            if(!isValid) {
                isFormValid = false
                errors[name] = rule.errorMassage
            }
        });
    }

    return {
        isFormValid,
        errors
    }
}

const convertFormDataToObj = (formdata) => {
    let formInfoObj = {}
    for (let [key, value] of formdata) {
        if (key === "description" && !value) {
            value = " "
        }
        formInfoObj[key] = value
    }

    return formInfoObj
}
const highlightErroredInput = (form, errors) => {
    for (let key in errors) {
        const text = errors[key]
        const erroredInput = form.querySelector(`input[name=${key}]`)

        if (!erroredInput.nextElementSibling.classList.contains('error')) {
            const errorElem = document.createElement('p')

            errorElem.innerText = text
            errorElem.classList.add('error')

            erroredInput.after(errorElem)
        }   
    }
}

function handleFormSubmit(form) {
    const formData = new FormData(form)
    const values = convertFormDataToObj(formData)
    const validationResult = validateForm(values, validaionRules)
   
    if(!validationResult.isFormValid) {
        highlightErroredInput(form, validationResult.errors)
        return
    }
    return values
}

export const handleLoginForm = async (e) => {
    e.preventDefault()
    const values = handleFormSubmit(e.target)
    if (values) {
        try { 
            await api.login(values)
        } catch(err){
            console.log(err)
        }

        clearFormInputs(e.target)
        checkAuthorization()
    }
}

export const handleRegisterForm = async (e) => {
    e.preventDefault()
    const values = handleFormSubmit(e.target)

    if (values) {
        try {
            await api.register(values)
            const { email, password } = values
            await api.login({ email, password })
        } catch(err){
            console.log(err)
        }
    
        clearFormInputs(e.target)
        checkAuthorization() 
    }    
}

export const handTaskAdderForm = async (e) => {
    e.preventDefault()
    const values = handleFormSubmit(e.target)
    
    if (values) {
        try {
            const taskInfo = await api.createTask(values)
            const taskCard = new Task(taskInfo)
            taskCard.createTaskCard(tasksWrapperElem)
        } catch(err){
            console.log(err)
        }
    
        clearFormInputs(e.target)
    } 
}

export const logoutBtn = document.getElementById('logout__btn')
export function checkAuthorization() {
    const tasksContainer = document.getElementById('tasks')
    const authorizationContainer = document.getElementById('authorization')

    if(localStorage.getItem("token")) {
        authorizationContainer.classList.add('hidden')
        logoutBtn.classList.remove('hidden')
        tasksContainer.classList.remove('hidden') 

        setUserInfoTitle()
        createTaskCardFromServer()
    } else {
        authorizationContainer.classList.remove('hidden')
        logoutBtn.classList.add('hidden')
        tasksContainer.classList.add('hidden') 
    }
}


async function setUserInfoTitle() {
    api.isLoggedIn()
    const userInfo = await api.getSelf()
    const title = document.getElementById('user__info')
    title.innerText = userInfo.name +'`s'   
}


export async function createTaskCardFromServer() {
    api.isLoggedIn()
    const response = await api.getAllTask()

    tasksWrapperElem.innerHTML = ""
    response.forEach(card => {
        const taskCardServer = new Task(card)
        taskCardServer.createTaskCard(tasksWrapperElem)
    })
}

/*
function setStoragePerAuthorization(responseData) {
    TOKEN = responseData.token
    
    if (!TOKEN) {
        return
    }
    localStorage.setItem("token", TOKEN)
    localStorage.setItem("authorized", "true")
}


const authorizationError = document.getElementById('authorization__error')
const authorizationErrorText = document.getElementById('authorization__error-message__text')

authorizationError.addEventListener("click", function(e) {
    if(e.target === this || e.target.classList.contains('authorization__error-сlose')){
        this.classList.add('hidden')
    } else {
        return
    }
})
export const renderAuthorizationError = (err) => {
    authorizationError.classList.remove('hidden')
    let text =''

    if (err.status === 401) {
        text = `Вы указали неправильный email или пароль`
    } else {
        text = `${err.status} ${err.statusText}`
    }
    if (!err.status) {
        text = `${err}`
    }
    authorizationErrorText.innerHTML = `Error: ${text}`
}
function loginAuthorize(data) {
    const loginResult = fetchInfo({...fetchActionList.login, dataObj: data})
    loginResult.then(response => {
        if (!response) {
            return
        } 
        setStoragePerAuthorization(response)
        checkAuthorization()
    }).catch(err => console.log(err))
} 
*/

