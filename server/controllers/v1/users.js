const admin = require(`firebase-admin`);
const { User } = require(`../../models`);

async function create(req, res) {
  let { id, name, avatar } = req.body;

  if (!id) {
    return res.boom.badData(``, {
      errors: [`User.id cannot be null`],
    });
  }

  try {
    const user = await User.create({
      id,
      name,
      avatar,
    });

    res.send(user.dataValues);
  } catch (error) {
    switch (error.name) {
      case `SequelizeValidationError`:
        return res.boom.badData(``, {
          errors: error.errors.map(a => a.message),
        });
      case `SequelizeUniqueConstraintError`:
        return res.boom.conflict(``, {
          errors: error.errors.map(a => a.message),
        });
      default:
        return res.boom.serverUnavailable();
    }
  }
}

async function get(req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.boom.notFound(`User not found`);
    }

    res.send(user);
  } catch (error) {
    return res.boom.serverUnavailable();
  }
}

async function update(req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.boom.notFound(`User not found`);
    }

    const { name, avatar } = req.body;

    const updatedUser = await user.update({
      name: name || user.name,
      avatar: avatar || user.avatar,
    });

    if (name) {
      admin.auth().updateUser(user.id, {
        displayName: name,
      });
    }

    res.send(updatedUser);
  } catch (error) {
    return res.boom.serverUnavailable();
  }
}

async function list(_, res) {
  try {
    const users = await User.all();
    return res.send(users);
  } catch (error) {
    return res.boom.serverUnavailable();
  }
}

module.exports = {
  create,
  get,
  update,
  list,
};
