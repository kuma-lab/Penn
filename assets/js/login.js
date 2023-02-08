/*****************************
 * Verify form field submit
 *****************************/

// Utility functions:
const el = (sel, parent) => (parent || document).querySelector(sel)
const els = (sel, parent) => (parent || document).querySelectorAll(sel)
const elNew = (tag, prop) => Object.assign(document.createElement(tag), prop)


// Form validation script:
const loginForm = el("#loginForm");

const validateForm = (evt) => { 
    evt.preventDefault()
  // Remove old errors
  els(".loginError", loginForm).forEach(el => el.remove())

  // Prepare an array to hold your errors
  const errors = []

  // Get the desired fields
  const passField = el('[name="loginPassword"]', loginForm)
  const emailField = el('[name="loginEmail"]', loginForm)

  // Validation and errors
  if (!/^.+@.+\./.test(emailField.value)) {
    errors.push({name: "loginEmail", text: "Invalid Email address"})
  }
  
  if (passField.value.trim().length <= 8) {
    errors.push({name: "loginPassword", text: "Password is too short (min 8 chars)"})
  }
  
  // Show errors
  errors.forEach(err => {
    const loginError = elNew("span", {
      className: "loginError",
      textContent: err.text,
    });
    el(`[name="${err.name}"]`, loginForm).closest("label").append(loginError)
  });
  
  // Prevent Form submit on any error
  if (!errors.length) {
    /***********************************
    /* initialize user for localStorage
    ************************************/
    // @todo : replace by user's id send by server
    const idUser = 1234
    // Set user Object with defaults values
    const userOptions = {
      "email": emailField.value,
      "feed": "press",
      "slidePress": 0,
      "slidePub": 0,
      "slideTalk": 0
    }

    // If users exists on this browser
    if (localStorage.getItem('usersOptions')) {
      // Get users options on local storage
      let usersOptionsStorage = JSON.parse(localStorage.getItem('usersOptions'))
      // Verify if idUser exist
      if(!usersOptionsStorage.hasOwnProperty(idUser)) {
        // idUser doesn't exit so we add it
        usersOptionsStorage[idUser] = userOptions
        localStorage.setItem('usersOptions', JSON.stringify(usersOptionsStorage))
      }
    } else {
      // Else we initialized it with first user
      localStorage.setItem('usersOptions', JSON.stringify({[idUser]: userOptions}))
    }
  }
};

loginForm.addEventListener("submit", validateForm)