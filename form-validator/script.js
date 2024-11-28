const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const url = '';

function sendHttpsRequest(method, url, date) {
  return fetch(url, {
    method: method,
    body: JSON.stringify(date),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        response.json().then((errDate) => {
          console.log(errDate);
          throw new Error(
            `some thing is wrong server side: ${response.status}`
          );
        });
      }
    })
    .catch((error) => {
      throw new Error(error.message);
    });
}

// Show input error message
function showError(input, message) {
  const formControl = input.parentElement;
  formControl.className = 'form-control error';
  const small = formControl.querySelector('small');
  small.innerText = message;
}

// Show success outline
function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.className = 'form-control success';
}

// Check email is valid
function checkEmail(input) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(input.value.trim())) {
    showSuccess(input);
    return true;
  } else {
    showError(input, 'Email is not valid');
    return false;
  }
}

// Check required fields
function checkRequired(inputArr) {
  inputArr.forEach(function (input) {
    if (input.value.trim() === '') {
      showError(input, `${getFieldName(input)} is required`);
      return false;
    } else {
      showSuccess(input);
    }
  });
  return true;
}

// Check input length
function checkLength(input, min, max) {
  if (input.value.length < min) {
    showError(
      input,
      `${getFieldName(input)} must be at least ${min} characters`
    );
    return false;
  } else if (input.value.length > max) {
    showError(
      input,
      `${getFieldName(input)} must be less than ${max} characters`
    );
    return false;
  } else {
    showSuccess(input);
    return true;
  }
}

// Check passwords match
function checkPasswordsMatch(input1, input2) {
  if (input1.value !== input2.value) {
    showError(input2, 'Passwords do not match');
    return false;
  }
  return true;
}

// Get fieldname
function getFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// Event listeners
form.addEventListener('submit', function (e) {
  e.preventDefault();

  let ok =
    checkRequired([username, email, password, password2]) &&
    checkLength(username, 3, 15) &&
    checkLength(password, 6, 25) &&
    checkEmail(email) &&
    checkPasswordsMatch(password, password2);
  if (ok) {
    let usernameValue = username.value;
    let emailValue = email.value;
    let passwordValue = password.value;
    const post = {
      username: usernameValue,
      email: emailValue,
      password: passwordValue,
    };
    sendHttpsRequest('POST', url, post);
  }
});
