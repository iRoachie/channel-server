const express = require(`express`);
const { apiVersion1 } = require(`../controllers`);

module.exports = app => {
  const v1 = express.Router();

  app.use(`/v1`, v1);

  v1.get(`/`, (_, res) =>
    res.status(200).send({
      message: `Welcome to the Channel API!`,
    })
  );

  // Users
  v1.get(`/users`, apiVersion1.users.list);
  v1.get(`/users/:id`, apiVersion1.users.get);
  v1.put(`/users/:id`, apiVersion1.users.update);
  v1.post(`/users`, apiVersion1.users.create);

  // Courses
  v1.get(`/courses`, apiVersion1.courses.list);
  v1.get(`/courses/:courseId`, apiVersion1.courses.get);
  v1.get(
    `/courses/:courseId/lecturers`,
    apiVersion1.courses.listReviewedLecturers
  );
  v1.post(`/courses`, apiVersion1.courses.create);

  // Schools
  v1.get(`/schools`, apiVersion1.schools.list);
  v1.post(`/schools`, apiVersion1.schools.create);
  v1.put(`/schools/:id`, apiVersion1.schools.update);

  // Lecturers
  v1.get(`/lecturers`, apiVersion1.lecturers.list);
  v1.get(`/lecturers/:id`, apiVersion1.lecturers.get);
  v1.get(`/lecturers/:id/courses`, apiVersion1.lecturers.courses);
  v1.post(`/lecturers`, apiVersion1.lecturers.create);
  v1.put(`/lecturers/:id`, apiVersion1.lecturers.update);

  // Reviews
  v1.get(`/reviews`, apiVersion1.reviews.list);
  v1.post(`/reviews`, apiVersion1.reviews.create);

  // Releases
  v1.get(`/releases`, apiVersion1.releases.list);
  v1.post(`/releases`, apiVersion1.releases.create);
  v1.put(`/releases/:id`, apiVersion1.releases.update);
};
