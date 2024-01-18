import express from "express";
import { engine } from "express-handlebars";
import fs from "fs/promises";
import handlebars from "handlebars";

const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./templates");

const MENU = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Contact", link: "/contact" },
];

async function renderPage(response, page) {
  response.render(page, {
    menuItems: MENU
  });
}

app.get("/", async (request, response) => {
  renderPage(response, "index");
});

app.get("/about", async (request, response) => {
  renderPage(response, "about");
});

app.get("/contact", async (request, response) => {
  renderPage(response, "contact");
});

app.use(express.static('static'));

app.listen(3080);
