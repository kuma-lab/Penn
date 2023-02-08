// Get user options on localStorage
function getUserOption(idUser, option) {
    // Get users options on localStorage
    let usersOptionsStorage = JSON.parse(localStorage.getItem('usersOptions'))
    // Get only option for connect user
    const userOptions = usersOptionsStorage[idUser]
    // Get value of the right option
    let valueOption = ''
    Object.keys(userOptions).find((key) => {if(key === option) valueOption = userOptions[key]})
    return valueOption
}

const idUser = 1234
console.log('get user option',getUserOption(idUser, 'email'))

// Set new value or user options on localStorage
function setUserOption(idUser, option, newValue) {
    let usersOptionsStorage = JSON.parse(localStorage.getItem('usersOptions'))
    // Get only option for connect user
    const userOptions = usersOptionsStorage[idUser]
    // Change right option with new value
    Object.keys(userOptions).find((key) => {if(key === option) userOptions[key] = newValue})
    usersOptionsStorage[idUser] = userOptions
    localStorage.setItem('usersOptions', JSON.stringify(usersOptionsStorage))
    console.log('new value userOptions', userOptions)
}

setUserOption(idUser, 'feed', 'talk')