const { School } = require('../models');

function list(_, res) {
  School.findAll({
    attributes: ['id', 'name'],
  })
    .then(schools => res.status(200).send(schools))
    .catch(() => res.boom.serverUnavailable());
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

function update(req, res) {
  School.findById(req.params.id)
    .then(school => {
      if (!school) {
        return res.boom.notFound('School not found for id');
      }

      return school
        .update({
          name: req.body.name,
        })
        .then(() => res.status(200).send(school))
        .catch(error => {
          if (error.name === 'SequelizeValidationError') {
            return res.boom.badData('', {
              errors: error.errors.map(a => a.message),
            });
          }

          res.boom.serverUnavailable();
        });
    })
    .catch(() => res.boom.serverUnavailable());
}

module.exports = {
  create,
  list,
  update,
};
