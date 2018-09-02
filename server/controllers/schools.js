const { School } = require('../models');

async function list(_, res) {
  try {
    const schools = await School.findAll({
      attributes: ['id', 'name'],
    });

    res.send(schools);
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
