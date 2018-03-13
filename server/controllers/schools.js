const School = require("../models").School;

function list(_, res) {
  School.all()
    .then(schools => res.status(200).send(schools))
    .catch(error => res.status(400).send(error));
}

function update(req, res) {
  if (!req.body.name) {
    return res.status(400).send({ status: "error", message: "Missing name" });
  }

  School.findById(req.params.id)
    .then(school => {
      if (!school) {
        return res.status(404).send({
          message: "School not found for id",
        });
      }

      return school
        .update({
          name: req.body.name,
        })
        .then(() => res.status(200).send(school))
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
}

module.exports = {
  list,
  update,
};
