// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

let password = document.getElementById("password");
if (password) {
  let showPass = document.querySelector(".showPass");
  showPass.addEventListener('click', event => {
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  })
}

let scrollableFilters = document.querySelector(".scrollable");
scrollableFilters.addEventListener("wheel", (event) => {
  event.preventDefault();
  const isTouchpad = Math.abs(event.deltaX);
  const scrollAmount = isTouchpad ? event.deltaX : event.deltaY;
  scrollableFilters.scrollBy({
    left: scrollAmount
  })
})

let taxSwitch = document.getElementById("switchCheckDefault");
taxSwitch.addEventListener("click", () => {
  let taxInfo = document.getElementsByClassName("tax-info");
  for (element of taxInfo) {
    if (taxSwitch.checked) {
      element.style.display = "inline";
    } else {
      element.style.display = "None";
    }
  }

})