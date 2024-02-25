const signupPassword = document.getElementById('signupPassword');

//Password Strength logic
if (signupPassword) {
  signupPassword.addEventListener('keyup', () => {
    const emptyCircleOne = document.getElementById('emptyCircleOne');
    const emptyCircleTwo = document.getElementById('emptyCircleTwo');
    const emptyCircleThree = document.getElementById('emptyCircleThree');

    if (signupPassword.value.length < 8) {
      emptyCircleOne.innerHTML =
        '<i class="fa-solid fa-circle" style="color: #f10404;"></i>';
      emptyCircleTwo.innerHTML = '<i class="fa-regular fa-circle"></i>';
      emptyCircleThree.innerHTML = '<i class="fa-regular fa-circle"></i>';
    } else if (
      signupPassword.value.length >= 8 &&
      signupPassword.value.match(/[A-Z]/)
    ) {
      emptyCircleTwo.innerHTML =
        '<i class="fa-solid fa-circle" style="color: #FFD43B;"></i>';
    } else {
      emptyCircleTwo.innerHTML = '<i class="fa-regular fa-circle"></i>';
    }
    if (
      signupPassword.value.length >= 8 &&
      signupPassword.value.match(/[A-Z]/) &&
      signupPassword.value.match(/\d/)
    ) {
      emptyCircleThree.innerHTML =
        '<i class="fa-solid fa-circle" style="color: #63E6BE;"></i>';
    } else {
      emptyCircleThree.innerHTML = '<i class="fa-regular fa-circle"></i>';
    }
  });
}

const signupButton = document.getElementById('signupButton');

if (signupButton) {
  signupButton.addEventListener('click', () => {
    window.location.href = './signup';
  });
}

//New user registration
const form = document.getElementById('signupForm');
const signupPageButton = document.getElementById('signupPageButton');
let users = JSON.parse(localStorage.getItem('users')) || [];
window.users = users;

if (form && signupPageButton) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let newUser = {};
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const signupPassword = document.getElementById('signupPassword').value;

    newUser.name = firstName;
    newUser.lastName = lastName;
    newUser.password = signupPassword;
    newUser.email = email;
    newUser.phone = phone;
    users.push(newUser);

    localStorage.setItem('users', JSON.stringify(users)); // Store users in localStorage

    window.location.href = './login';
  });
}

const loginForm = document.getElementById('loginForm');
const loginButton = document.getElementById('loginButton');

if (loginForm && loginButton) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = document.getElementById('usernameLogin').value;
    const password = document.getElementById('passwordLogin').value;

    const users = JSON.parse(localStorage.getItem('users')) || []; // Retrieve users from localStorage

    const usernameTry = users.find((user) => user.email === username);

    if (usernameTry && usernameTry.password === password) {
      // Check if usernameTry is not undefined
      document.getElementById('logoutButton').style.display = 'block';
      let loginLink = Array.from(document.querySelectorAll('.menuItem a')).find(a => a.textContent === 'Login');
      
      window.location.href = '/';
      console.log('Logged in');
    } else {
      document.getElementById('loginError').style.display = 'block';
      console.log('Wrong password or user not found');
    }
  });
}

/*const users = [
  {name: 'sebastian',
  password: 123},
  {name: 'erik',
  password: 123}
];

const erik = users.find(user => user.name === 'erik');
console.log(erik.password); 456
*/
