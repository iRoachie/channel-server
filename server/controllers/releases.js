const { Release } = require('../models');

function list(_, res) {
  Release.all()
    .then(releases => res.status(200).send(releases))
    .catch(() => res.boom.serverUnavailable());
}

function create({ body }, res) {
  const { title, cover, magazine } = body;

  return Release.create({
    title,
    cover,
    magazine,
  })
    .then(course => res.status(200).send(course))
    .catch(error => {
      if (error.name === 'SequelizeValidationError') {
        return res.boom.badData('', {
          errors: error.errors.map(a => a.message),
        });
      }

      res.boom.serverUnavailable();
    });
}

function update({ body, params }, res) {
  if (!body.title && !body.cover && !body.magazine) {
    return res.boom.badData('Missing `title`, `cover`, or `magazine`');
  }

  Release.findById(params.id)
    .then(release => {
      if (!release) {
        return res.boom.notFound('Release not found for id');
      }

      return release
        .update({
          title: body.title || release.title,
          cover: body.cover || release.cover,
          magazine: body.magazine || release.magazine,
        })
        .then(() => res.status(200).send(release))
        .catch(() => res.boom.serverUnavailable());
    })
    .catch(() => {
      res.boom.serverUnavailable();
    });
}

module.exports = {
  list,
  create,
  update,
};
