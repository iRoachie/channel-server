import * as admin from 'firebase-admin';
require('firebase-functions');

const { User } = require('../models');
import { DEFAULT_AVATAR } from '../config/constants';

admin.initializeApp();

async function create(req, res) {
  const { id: firebase_id, name } = req.body;
  let { avatar } = req.body;

  if (!firebase_id) {
    res.status(422).send({
      message: 'Missing param `id` in body',
    });
  }

  if (!name) {
    res.status(422).send({
      message: 'Missing param `name` in body',
    });
  }

  if (!avatar) {
    avatar = DEFAULT_AVATAR;
  }

  try {
    const user = await User.create({
      firebase_id: firebase_id,
      name,
      avatar,
    });

    res.status(200).send({
      data: {
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

async function update(req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).send({
        message: 'User not found',
      });
    }

    const { name, avatar } = req.body;

    const updatedUser = await user.update({
      name: name || user.name,
      avatar: avatar || user.avatar,
    });

    if (name) {
      admin.auth().updateUser(user.firebase_id, {
        displayName: name,
      });
    }

    res.status(200).send(updatedUser);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function list(_, res) {
  try {
    const users = await User.all();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
}

export { create, get, update, list };
