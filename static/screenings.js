const screenings = [];

async function screening() {
    const response = await fetch('/screenings?pagination%5BpageSize%5D=10');
    const screenings = await response.json();
    console.log(screenings);
}

