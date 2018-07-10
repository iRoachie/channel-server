const {
  users,
  courses,
  schools,
  lecturers,
  reviews,
  releases,
} = require('../controllers');

module.exports = app => {
  app.get('/api', (_, res) =>
    res.status(200).send({
      message: 'Welcome to the Channel API!',
    })
  );

  // Users
  app.get('/api/users', users.list);
  app.get('/api/users/:id', users.get);
  app.put('/api/users/:id', users.update);
  app.post('/api/users', users.create);

  // Courses
  app.get('/api/courses', courses.list);
  app.get('/api/courses/:courseId', courses.get);
  app.post('/api/courses', courses.create);

  // Schools
  app.get('/api/schools', schools.list);
  app.put('/api/schools/:id', schools.update);

  // Lecturers
  app.get('/api/lecturers', lecturers.list);
  app.get('/api/lecturers_reviews', lecturers.listWithReviews);
  app.get('/api/lecturers/:id', lecturers.get);
  app.get('/api/lecturers/:id/reviews', lecturers.reviews);
  app.get('/api/lecturers/:id/reviews/:courseId', lecturers.reviewsForCourse);
  app.get('/api/lecturers/:id/courses', lecturers.courses);
  app.post('/api/lecturers', lecturers.create);
  app.put('/api/lecturers/:id', lecturers.update);

  // Reviews
  app.get('/api/reviews', reviews.list);
  app.post('/api/reviews', reviews.create);

  // Releases
  app.get('/api/releases', releases.list);
  app.post('/api/releases', releases.create);
  app.put('/api/releases/:id', releases.update);
};
