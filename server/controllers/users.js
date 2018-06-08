const admin = require('firebase-admin');
const { User } = require('../models');
const { DEFAULT_AVATAR } = require('../config/constants');

async function create(req, res) {
  let { name, email, password, avatar } = req.body;

  if (!name) {
    res.status(422).send({
      message: 'Missing param `name` in body',
    });
  }

  if (!email) {
    res.status(422).send({
      message: 'Missing param `email` in body',
    });
  }

  if (!password) {
    res.status(422).send({
      message: 'Missing param `password` in body',
    });
  }

  if (!avatar) {
    avatar = DEFAULT_AVATAR;
  }

  try {
    const userRecord = await admin.auth().createUser({
      displayName: name,
      email,
      password,
    });

    const user = await User.create({
      firebase_id: userRecord.uid,
      name,
      avatar,
    });

    res.status(200).send({
      data: {
        email,
        ...user.dataValues,
      },
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

async function get(req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).send({
        message: 'User not found',
      });
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
}

function update(req, res) {
  return User.findById(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: 'User not found',
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

async function list(_, res) {
  try {
    const users = await User.all();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = {
  create,
  get,
  update,
  list,
};
``;
