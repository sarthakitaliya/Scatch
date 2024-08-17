const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');



form.addEventListener('submit', e => {
    e.preventDefault();

    if (validateInputs()) {
        form.submit();
    }
});

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    
    errorDisplay.innerText = message;
    element.style.borderColor = "#ff3860";
}
const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    element.style.borderColor = "#09c372";
}
const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
const validateInputs = () => {
    let isValid = true;
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if(usernameValue == ''){
        setError(username, 'Username is required');
        isValid = false;
    }else{
        setSuccess(username);
    }
    if(emailValue == ''){
        setError(email, 'Email is required');
        isValid = false;
    }else if(!isValidEmail(emailValue)){
        setError(email, 'Please enter a valid email address');
        isValid = false;
    }else{
        setSuccess(email);
    }
    if(passwordValue === '') {
        setError(password, 'Password is required');
        isValid = false;
    } else if (passwordValue.length < 8 ) {
        setError(password, 'Password must be at least 8 character.')
        isValid = false;
    } else {
        setSuccess(password);
    }
    return isValid;
}