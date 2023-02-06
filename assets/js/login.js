/***********************************
/* initialize email for localStorage
************************************/

// Testing email: brunet.pierre.gorn@gmail.com / damon.centola@asc.upenn.edu

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
    localStorage.setItem('email', emailField.value)
  }
};

loginForm.addEventListener("submit", validateForm)