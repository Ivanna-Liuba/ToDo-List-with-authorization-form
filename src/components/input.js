export const handleInput = (e) => {
    const currentInput = e.target;
    const nextSibling = currentInput.nextElementSibling
    if(nextSibling.classList.contains('error')) {
        nextSibling.remove()
    }
}

export const clearFormInputs = (form) => {
    const inputs = form.querySelectorAll('input')

    inputs.forEach(input => input.value = '')
}
