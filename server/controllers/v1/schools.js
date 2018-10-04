const { School } = require('../../models');
const { validateParams, paginateResults } = require('../../util');

async function list(req, res) {
  const valid = validateParams(req, res);

  if (!valid) {
    return;
  }

  const { skip, limit } = valid;

  try {
    const { rows, count } = await School.findAndCountAll({
      offset: skip,
      limit,
      attributes: ['id', 'name'],
    });

    res.send(paginateResults({ rows, count, skip, limit }));
  } catch (error) {
    return res.boom.serverUnavailable();
  }
}

async function create(req, res) {
  try {
    const school = await School.create({
      name: req.body.name,
    });

    res.send(school);
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

async function update(req, res) {
  try {
    const school = await School.findById(req.params.id);

    if (!school) {
      return res.boom.notFound('School not found for id');
    }

    await school.update({
      name: req.body.name,
    });

    res.send(school);
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

module.exports = {
  create,
  list,
  update,
};
