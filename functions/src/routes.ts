import {
  users,
  courses,
  schools,
  lecturers,
  reviews,
  releases,
} from './controllers';

module.exports = app => {
  app.get('/', (_, res) =>
    res.status(200).send({
      message: 'Welcome to the Channel API!',
    })
  );

  // Users
  app.get('/users', users.list);
  app.get('/users/:id', users.get);
  app.put('/users/:id', users.update);
  app.post('/users', users.create);

  // Courses
  app.get('/courses', courses.list);
  app.get('/courses/:courseId', courses.get);
  app.post('/courses', courses.create);

  // Schools
  app.get('/schools', schools.list);
  app.put('/schools/:id', schools.update);

  // Lecturers
  app.get('/lecturers', lecturers.list);
  app.get('/lecturers_reviews', lecturers.listWithReviews);
  app.get('/lecturers/:id', lecturers.get);
  app.get('/lecturers/:id/reviews', lecturers.reviews);
  app.get('/lecturers/:id/reviews/:courseId', lecturers.reviewsForCourse);
  app.get('/lecturers/:id/courses', lecturers.courses);
  app.post('/lecturers', lecturers.create);
  app.put('/lecturers/:id', lecturers.update);

  // Reviews
  app.get('/reviews', reviews.list);
  app.post('/reviews', reviews.create);

  // Releases
  app.get('/releases', releases.list);
  app.post('/releases', releases.create);
  app.put('/releases/:id', releases.update);
};
