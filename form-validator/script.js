const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const phoneNumber = document.getElementById('phone-number');
const url = 'https://localhost/bikeregister/register.php';

function sendHttpsRequest(method, url, date) {
  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    // const formData = new FormData(form);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: date,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      console.log('Success:', result);

      if (result.includes('success')) {
        console.log('Success:', result);
        // window.location.href = 'index.php?loginmsg=hello';
      } else {
        console.log('Error:', result.error);
        alert(result.error);
      }
    } catch (error) {
      console.log('Error:', error.message);
    }
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
    checkRequired([username, email, password, password2, phoneNumber]) &&
    checkLength(username, 3, 15) &&
    checkLength(password, 6, 25) &&
    checkEmail(email) &&
    checkPasswordsMatch(password, password2);
  if (ok) {
    const fd = new FormData(form);
    sendHttpsRequest('POST', url, fd);
    const arr = [username, email, password, password2, phoneNumber];
    arr.forEach(function (input) {
      input.parentElement.className = 'form-control';
    });
    form.reset();
  }
});
