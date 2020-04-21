const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const likes = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, techs, url };
    repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
      return response.status(400).json({error: "Repository not found"});
  }

  const repository = {
      id,
      title,
      techs,
      url,
  };

    repositories[repositoryIndex] = repository;

  return response.json(repository);


});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(project => project.id === id);
  if (repositoryIndex < 0) {
      return response.status(400).json({error: "Repository not found"});
  }

  repositories.splice(repositoryIndex,1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
    const { id } = request.params;
    const repositoryIndex = repositories.findIndex(project => project.id === id);
    if (repositoryIndex < 0) {
        return response.status(400).json({error: "Repository not found"});
    }

    const likeIndex = likes.findIndex(liked => liked.id === id);
    if (likeIndex < 0) {
        const liked = {
            id,
            like: 1,
        };
        likes.push(liked);


        return response.json(liked);
    } else {
        const liked = {
            id,
            like: likes[likeIndex].like + 1,
        };

        likes[likeIndex] = liked;

        return response.json(likes[likeIndex]);
    }




});

module.exports = app;
