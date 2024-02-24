const signupPassword = document.getElementById('signupPassword');

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
