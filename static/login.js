const form = document.getElementById("form");

// Saving sign up data in an array to be used later on
function storeInput() {
  event.preventDefault();
  // Initialise an empty array
  const inputArray = [];

  // Get input elements
  const inputUsername = document.getElementById("username");
  const inputPass = document.getElementById("password");

  // Get values of the elements
  const userName = inputUsername.value;
  const userPass = inputPass.value;

  // Add values to array
  inputArray.push(userName, userPass);

  //Print array to console
  console.log(inputArray);
}
