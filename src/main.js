import "./style/main.css";
import { handleLoginForm, handleRegisterForm, handTaskAdderForm, checkAuthorization, logoutBtn } from "./components/form.js";
import { handleInput } from "./components/input.js"
import { api } from "./components/api.js"

//начало гланого екрана - формы авторизации
const forms = document.querySelectorAll('.form')
const loginBtnAppear = document.getElementById('form__login-btn__appear');
const registerBtnAppear = document.getElementById('form__register-btn__appear');
const formBackup = document.getElementById('forms__container-backup');

const moveFormBackup = (clickedBtn) => {
    switch(clickedBtn) {
        case loginBtnAppear: 
            formBackup.classList.remove('shifted__right')
            break
        case registerBtnAppear: 
            formBackup.classList.add('shifted__right')
            break  
    }
}
const showForm = (showedForm) => {
    forms.forEach(form => form.classList.add('notactive'))
    showedForm.classList.remove('notactive')
}
forms.forEach(form => {
    form.addEventListener('click', function(e) {
        const clickedElem = e.target

        if(clickedElem.tagName !== "BUTTON") {
            return
        }
        moveFormBackup(clickedElem)
        showForm(this)
    
    })
})

//отправка пост-запроса при логине
const formLogin = document.getElementById('form__login');
const formRegister = document.getElementById('form__register');

formLogin.addEventListener('submit', handleLoginForm)
formRegister.addEventListener('submit', handleRegisterForm)

formLogin.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', (e)=> {
        handleInput(e)
    })
})
formRegister.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', (e)=> {
        handleInput(e)
    })
})

//создание нового task__card
const formTaskAdd = document.getElementById('task__adder-form');
const taskNameInput = formTaskAdd.querySelector('input[name="name"]')

formTaskAdd.addEventListener('submit', handTaskAdderForm)
taskNameInput.addEventListener('input', handleInput)


logoutBtn.addEventListener('click', () => {
    api.logout()
    const title = document.getElementById('user__info')
    title.innerText = 'Your'
    checkAuthorization()
})

checkAuthorization()

