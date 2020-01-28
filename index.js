const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

let counter = 0;

server.use((req, res, next) => {

  console.log('iniciando middleware global');
  counter ++;
  console.log(`Metodo: ${req.method} | Rota: ${req.url} | Total req: ${counter}`);
  
  next();
});

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const indexToId = projects.findIndex(project => project.id === id);
  if (indexToId === -1) {
    return res.status(400).json('Project does not exists');
  }
  req.index = indexToId;
  next();
}

//cria project
server.post('/projects', (req, res) => {
  const { id, title, tasks } = req.body;

  projects.push({ id, title, tasks });

  return res.json(projects);
});

//busca project
server.get('/projects', (req, res) => {
  return res.json(projects);
});

//altera project
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { title } = req.body;

  projects[req.index].title = title;

  return res.json(projects);
});

//deleta project
server.delete('/projects/:id', checkProjectExists, (req, res) => {

  projects.splice(req.index, 1);

  return res.send();
})

//cria task ao project
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { title } = req.body;

  projects[req.index].tasks.push(title);

  return res.json(projects);
});


server.listen(3333);
