const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const likes = [];

app.get("/repositories", (request, response) => {
  const array = mergeArraysById(repositories, likes);
  return response.json(array);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, techs, url };
  const liked = {
      id: repository.id,
      like: 0,
  };
  likes.push(liked);

  repositories.push(repository);

  return response.json({ id: repository.id, tile: repository.title, techs: repository.techs, url: repository.url, likes: liked.like });
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

  const likesIndex = likes.findIndex(like => like.id === id);
  if (likesIndex < 0) {
      return response.status(204).send();
  }

  likes.splice(likesIndex, 1);

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
        return response.status(400).json({ error: "Repository not found"});
    } else {
        const liked = {
            id,
            like: likes[likeIndex].like + 1,
        };

        likes[likeIndex] = liked;

        return response.json(likes[likeIndex]);
    }
});

function mergeArraysById(array1, array2) {
    let start = 0;
    let merged = [];

    while (start < array1.length) {
        if (array1[start].id === array2[start].id) {
            merged.push({...array1[start], ...array2[start]});
        }
        start = start+1
    }
    return merged;
}

module.exports = app;



