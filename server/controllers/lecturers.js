const Lecturer = require("../models").Lecturer;

module.exports = {
  list(req, res) {
    Lecturer.all()
      .then(lecturers => res.status(200).send(lecturers))
      .catch(error => res.status(400).send(error));
  },
  create(req, res) {
    Lecturer.create({
      schoolId: req.body.school_id,
      name: req.body.name,
      avatar: req.body.avatar,
    })
      .then(lecturer => res.status(200).send(lecturer))
      .catch(error => res.status(400).send(error));
  },
  get(req, res) {
    Lecturer.findById(req.params.id)
      .then(lecturer => {
        if (!lecturer) {
          return res.status(404).send({
            message: "Lecturer with id not found",
          });
        }

        return res.status(200).send(lecturer);
      })
      .catch(error => res.status(400).send(error));
  },
  update(req, res) {
    Lecturer.findById(req.params.id)
      .then(lecturer => {
        if (!lecturer) {
          return res.status(404).send({
            message: "Lecturer with id not found",
          });
        }

        return lecturer
          .update({
            schoolId: req.body.school_id || lecturer.schoolId,
            name: req.body.name || lecturer.name,
          })
          .then(() => res.status(200).send(lecturer))
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
};
