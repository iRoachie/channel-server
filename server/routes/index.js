const userController = require("../controllers").users;
const courseController = require("../controllers").courses;
const schoolController = require("../controllers").schools;
const lecturerController = require("../controllers").lecturers;
const reviewController = require("../controllers").reviews;

module.exports = app => {
  app.get("/api", (_, res) =>
    res.status(200).send({
      message: "Welcome to the Channel API!",
    })
  );

  // Users
  app.get("/api/users", userController.list);
  app.get("/api/users/:id", userController.get);
  app.put("/api/users/:id", userController.update);
  app.post("/api/users", userController.create);

  // Courses
  app.get("/api/courses", courseController.list);
  app.get("/api/courses/:courseId", courseController.get);
  app.post("/api/courses", courseController.create);

  // Schools
  app.get("/api/schools", schoolController.list);
  app.put("/api/schools/:id", schoolController.update);

  // Lecturers
  app.get("/api/lecturers", lecturerController.list);
  app.get("/api/lecturers/:id", lecturerController.get);
  app.get("/api/lecturers/:id/reviews", lecturerController.reviews);
  app.get("/api/lecturers/:id/courses", lecturerController.courses);
  app.post("/api/lecturers", lecturerController.create);
  app.put("/api/lecturers/:id", lecturerController.update);

  // Reviews
  app.get("/api/reviews", reviewController.list);
  app.post("/api/reviews", reviewController.create);
};
