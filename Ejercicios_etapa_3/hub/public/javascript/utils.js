// D
export const disable = (button) => {
    button.disabled = true
    button.setAttribute('disabled', true)
    button.classList.add('opacity-50')
}

// E
export const enable = (button) => {
    button.disabled = false
    button.removeAttribute('disabled')
    button.classList.remove('opacity-50')
}
