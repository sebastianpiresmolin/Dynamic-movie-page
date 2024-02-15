const form = document.querySelector("form");
const passwordInput = document.getElementById("password");
const signupButton = document.querySelector("button#sign-up");
const togglePasswordButton = document.getElementById("toggle-password");

let pass = document.getElementById("password");
let msg = document.getElementById("message");
let str = document.getElementById("strength");

form.addEventListener("submit", handleFormSubmission);
passwordInput.addEventListener("input", resetCustomValidity);
togglePasswordButton.addEventListener("click", togglePassword);

function togglePassword() {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    togglePasswordButton.textContent = "Hide password";
    togglePasswordButton.setAttribute("aria-label", "Hide password.");
  } else {
    passwordInput.type = "password";
    togglePasswordButton.textContent = "Show password";
    togglePasswordButton.setAttribute(
      "aria-label",
      "Show password as plain text. " +
        "Warning: this will display your password on the screen."
    );
  }
}

function resetCustomValidity() {
  passwordInput.setCustomValidity("");
}

// Making password need to be 8 characters or more.
function validatePassword() {
  let message = "";
  if (!/.{8,}/.test(passwordInput.value)) {
    message = "At least eight characters. ";
  }
  passwordInput.setCustomValidity(message);
}

function handleFormSubmission(event) {
  event.preventDefault();
  validatePassword();
  form.reportValidity();
  if (form.checkValidity() === false) {
    // Handle invalid form
  } else {
    /*
    sendingForm();
*/
    // On a production site do form submission.
    alert("Signed up!");
    // Disable on successful sign-up — but don't disable pending valid input!
    signupButton.disabled = "true";
  }
} /*
/*
//Eventlistener when user clicks submit button
async function sendingForm(e) {
  // Finding form through this id
  const form = document.querySelector("form");

  const fullName = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  const payload = new URLSearchParams();
  payload.append("name:", fullName);
  payload.append("email:", email);
  payload.append("password:", password);

  console.log([...payload]);

  const response = await fetch("/signUp", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload,
  });
}
*/

//Password strength indicatior
pass.addEventListener("input", () => {
  if (pass.value.length > 0) {
    msg.style.display = "block";
  } else {
    msg.style.display = "none";
  }
  if (pass.value.length < 4) {
    //changes span strength to show weak
    str.innerHTML = "weak";
    //changes password input box border to another color
    // and message color to the same color as input box
    pass.style.borderColor = "#ff5925";
    msg.style.color = "#ff5925";
  } else if (pass.value.length >= 4 && pass.value.length < 8) {
    str.innerHTML = "medium";
    pass.style.borderColor = "orange";
    msg.style.color = "orange";
  } else if (pass.value.length >= 8) {
    str.innerHTML = "strong";
    pass.style.borderColor = "#26d730";
    msg.style.color = "#26d730";
  }
});

// Saving sign up data in an array to be used later on
function storeInput() {
  // Initialise an empty array
  const inputArray = [];

  // Get input elements
  const inputFullname = document.getElementById("name");
  const inputUsername = document.getElementById("username");
  const inputEmail = document.getElementById("email");
  const inputPass = document.getElementById("password");

  // Get values of the elements
  const userName = inputUsername.value;
  const fullName = inputFullname.value;
  const userEmail = inputEmail.value;
  const userPass = inputPass.value;

  // Add values to array
  inputArray.push(fullName, userName, userEmail, userPass);

  //Print array to console
  console.log(inputArray);
}
