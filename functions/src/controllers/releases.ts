const { Release } = require('../models');

function list(_, res) {
  Release.all()
    .then(releases => res.status(200).send(releases))
    .catch(error => res.status(400).send(error));
}

function create({ body }, res) {
  const { title, cover, magazine } = body;

  return Release.create({
    title,
    cover,
    magazine,
  })
    .then(course => res.status(200).send(course))
    .catch(error => res.status(400).send(error));
}

function update({ body, params }, res) {
  if (
    !body.hasOwnProperty('title') &&
    !body.hasOwnProperty('cover') &&
    !body.hasOwnProperty('magazine')
  ) {
    return res.status(400).send({
      status: 'error',
      message: 'Missing `title`, `cover`, or `magazine`',
    });
  }

  Release.findById(params.id)
    .then(release => {
      if (!release) {
        return res.status(404).send({
          message: 'Release not found for id',
        });
      }

      return release
        .update({
          title: body.title || release.title,
          cover: body.cover || release.cover,
          magazine: body.magazine || release.magazine,
        })
        .then(() => res.status(200).send(release))
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
}

export { list, create, update };
