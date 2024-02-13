const form = document.querySelector("form");
const passwordInput = document.getElementById("password");
const signupButton = document.querySelector("button#sign-up");
const togglePasswordButton = document.getElementById("toggle-password");

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
    sendingForm();
    // On a production site do form submission.
    alert("Signed up!");
    // Disable on successful sign-up — but don't disable pending valid input!
    signupButton.disabled = "true";
  }

  //Eventlistener when user clicks submit button
  async function sendingForm(e) {
    // Finding form through this id
    const form = document.querySelector("form");

    const fullName = document.querySelector("name");
    const email = document.querySelector("email");
    const password = document.querySelector("password");

    const payload = new URLSearchParams();
    payload.append("username", fullName);
    payload.append("email", email);
    payload.append("password", password);

    console.log([...payload]);

    const response = await fetch("/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload,
    });
  }
}
