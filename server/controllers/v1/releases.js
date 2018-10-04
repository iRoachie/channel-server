const { Release } = require(`../../models`);
const { paginateResults, validateParams } = require(`../../util`);

async function list(req, res) {
  const valid = validateParams(req, res);

  if (!valid) {
    return;
  }

  const { limit, skip } = valid;

  try {
    const { count, rows } = await Release.findAndCountAll({
      limit,
      offset: skip,
    });
    return res.send(paginateResults({ count, rows, skip, limit }));
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
      case `SequelizeValidationError`:
        return res.boom.badData(``, {
          errors: error.errors.map(a => a.message),
        });
      default:
        return res.boom.serverUnavailable();
    }
  }
}

async function update({ body, params }, res) {
  if (!body.title && !body.cover && !body.magazine) {
    return res.boom.badData(`Missing \`title\`, \`cover\`, or \`magazine\``);
  }

  try {
    const release = await Release.findById(params.id);

    if (!release) {
      return res.boom.notFound(`Release not found for id`);
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
