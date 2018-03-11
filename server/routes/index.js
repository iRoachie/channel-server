const userController = require('../controllers').users;

module.exports = app => {
  app.get('/api', (req, res) =>
    res.status(200).send({
      message: 'Welcome to the Channel API!'
    })
  );

  app.get('/api/users', userController.list);
  app.get('/api/users/:id', userController.get);
  app.put('/api/users/:id', userController.update);
  app.post('/api/users', userController.create);
};
