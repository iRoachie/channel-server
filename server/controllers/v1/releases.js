const { Release } = require('../../models');

async function list(_, res) {
  try {
    const releases = await Release.all();
    return res.send(releases);
  } catch (error) {
    return res.boom.serverUnavailable();
  }
}

async function create({ body }, res) {
  const { title, cover, magazine } = body;

  try {
    const release = await Release.create({
      title,
      cover,
      magazine,
    });

    return res.send(release);
  } catch (error) {
    switch (error.name) {
      case 'SequelizeValidationError':
        return res.boom.badData('', {
          errors: error.errors.map(a => a.message),
        });
      default:
        return res.boom.serverUnavailable();
    }
  }
}

async function update({ body, params }, res) {
  if (!body.title && !body.cover && !body.magazine) {
    return res.boom.badData('Missing `title`, `cover`, or `magazine`');
  }

  try {
    const release = await Release.findById(params.id);

    if (!release) {
      return res.boom.notFound('Release not found for id');
    }

    await release.update({
      title: body.title || release.title,
      cover: body.cover || release.cover,
      magazine: body.magazine || release.magazine,
    });

    return res.send(release);
  } catch (error) {
    return res.boom.serverUnavailable();
  }
}

module.exports = {
  list,
  create,
  update,
};
