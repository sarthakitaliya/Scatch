const form = document.getElementById('form');
const productname = document.getElementById('productname');
const price = document.getElementById('productprice');
const discount = document.getElementById('dicount');
const bgcolor = document.getElementById('bgcolor');
const panelcolor = document.getElementById('panelcolor');
const textcolor = document.getElementById('textcolor');
const fileInput = document.getElementById('productImage');

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

const validateInputs = () => {
    let isValid = true;

    const productnameValue = productname.value.trim();
    const priceValue = price.value.trim();
    const discountValue = discount.value.trim();
    const bgcolorValue = bgcolor.value.trim();
    const panelcolorValue = panelcolor.value.trim();
    const textcolorValue = textcolor.value.trim();
    const file = fileInput.files[0];

    if (!file) {
        setError(fileInput, "File is required");
        isValid = false;
    } else {
        setSuccess(fileInput);
    }

    if (productnameValue === '') {
        setError(productname, "Product Name is required");
        isValid = false;
    } else {
        setSuccess(productname);
    }

    if (priceValue === '') {
        setError(price, "Product Price is required");
        isValid = false;
    } else if (isNaN(priceValue)) {
        setError(price, "Product Price must be a number");
        isValid = false;
    } else {
        setSuccess(price);
    }

    if (discountValue === '') {
        setError(discount, "Discount is required");
        isValid = false;
    } else if (isNaN(discountValue)) {
        setError(discount, "Discount should be a number");
        isValid = false;
    } else {
        setSuccess(discount);
    }

    if (bgcolorValue === '') {
        setError(bgcolor, "Background Color is required");
        isValid = false;
    } else {
        setSuccess(bgcolor);
    }

    if (panelcolorValue === '') {
        setError(panelcolor, "Panel Color is required");
        isValid = false;
    } else {
        setSuccess(panelcolor);
    }

    if (textcolorValue === '') {
        setError(textcolor, "Text Color is required");
        isValid = false;
    } else {
        setSuccess(textcolor);
    }

    return isValid;
}
