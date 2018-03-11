const userController = require('../controllers').users;
const courseController = require('../controllers').courses;

module.exports = app => {
  app.get('/api', (req, res) =>
    res.status(200).send({
      message: 'Welcome to the Channel API!'
    })
  );

  // Users
  app.get('/api/users', userController.list);
  app.get('/api/users/:id', userController.get);
  app.put('/api/users/:id', userController.update);
  app.post('/api/users', userController.create);

  // Courses
  app.get('/api/courses', courseController.list);
  app.get('/api/courses/:courseId', courseController.get);
  app.post('/api/courses', courseController.create);
};
