/*
document.addEventListener("DOMContentLoaded", function () {
  // Hitta formuläret genom dess id
  const form = document.getElementById("reviewForm");

  // Lägg till en lyssnare för att fånga submit-händelsen
  form.addEventListener("submit", function (event) {
    // Förhindra standardformulärskickning
    event.preventDefault();

    // Hämta formulärdata
    const formData = new FormData(form);
    const payload = new URLSearchParams(formData);
    // Om du vill göra något med formulärdatan, kan du göra det här
    // Exempel: Skriv ut formulärdatan till konsolen
    for (const pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }


fetch('/form', {
  method: "POST",
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: payload,
})
.then((res) => res.json())
.then((data) => console.log(data))
.catch((err)  => console.log(err));


  });
});
*/
// Get data from form after everything is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Finding form through this id
  const form = document.getElementById("reviewForm");

  //Eventlistener when user clicks submit button
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    /*
    const formData = new FormData(form);
    const payload = new URLSearchParams(formData); 
    */
    const comment = document.querySelector("#comment").value;
    /*const movieId = document.querySelector("#movieTitle").value;*/

    // Get the current URL
    const currentUrl = window.location.href;

    // Split the URL by "/"
    const parts = currentUrl.split("/");

    // Extract the last part of the URL, which should be "8"
    const movieId = parts[parts.length - 1];

    console.log(movieId); // Outputs: 8

    const rating = document.querySelector("#rating").value;
    const name = document.querySelector("#name").value;

    const payload = new URLSearchParams();
    payload.append("id", movieId);
    payload.append("comment", comment);
    payload.append("rating", rating);
    payload.append("author", name);

    console.log([...payload]);

    const response = await fetch("/movies/:movieId/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload,
    });
  });
});
