const User = require("../models").User;

function create(req, res) {
  return User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    avatar: req.body.avatar,
  })
    .then(user => res.status(200).send(user))
    .catch(error => res.status(400).send(error));
}

function get(req, res) {
  return User.findById(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "User not found",
        });
      }

      return res.status(200).send(user);
    })
    .catch(error => res.status(400).send(error));
}

function update(req, res) {
  return User.findById(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "User not found",
        });
      }

      return user
        .update({
          name: req.body.name || user.name,
          avatar: req.body.avatar || user.avatar,
          password: req.body.password || user.password,
          email: req.body.email || user.email,
        })
        .then(() => res.status(200).send(user))
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
}

function list(_, res) {
  return User.all()
    .then(users => res.status(200).send(users))
    .catch(error => res.status(400).send(error));
}

module.exports = {
  create,
  get,
  update,
  list,
};
