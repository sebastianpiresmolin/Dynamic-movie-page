
const screenings = [];

async function screening() {
    const response = await fetch('/app/home/screenings?pagination%5BpageSize%5D=10&pagination%5Blimit%5D=10&populate=movie');
    const screening = await response.json();
    return screening = screenings;
}

window.onload = async function() {
    const result = await screening();
    console.log(result);
}
