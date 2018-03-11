const Course = require('../models').Course;

module.exports = {
  list(req, res) {
    return Course.all()
      .then(courses => res.status(200).send(courses))
      .catch(error => res.status(400).send(error));
  },

  get(req, res) {
    return Course.findOne({ where: { code: req.params.courseId } })
      .then(course => {
        if (!course) {
          return res.status(404).send({
            message: 'No course with that code'
          });
        }

        return res.status(200).send(course);
      })
      .catch(error => res.status(400).send(error));
  },

  create(req, res) {
    return Course.create({
      code: req.body.code,
      name: req.body.name
    })
      .then(course => res.status(200).send(course))
      .catch(error => res.status(400).send(error));
  }
};
