
let alert = document.querySelectorAll(".alert-box");
console.log(alert)
alert.innerText = "s"
setTimeout(() => {
    alert[0].remove();
    alert[1].remove();
}, 3000)