const { Course, Review, Lecturer, School } = require(`../../models`);
const { Op, fn, col, literal } = require(`sequelize`);
const { paginateResults, validateParams } = require(`../../util`);

async function list(req, res) {
  const valid = validateParams(req, res);

  if (!valid) {
    return;
  }

  const { search, limit, skip } = valid;

  try {
    const { rows, count } = await Course.findAndCountAll({
      limit,
      offset: skip,
      subQuery: false,
      where: {
        [Op.or]: [
          {
            code: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            name: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      },
      include: [
        {
          model: Review,
          attributes: [],
        },
      ],
      attributes: [
        `id`,
        `code`,
        `name`,
        [fn(`COUNT`, col(`Reviews.id`)), `totalReviews`],
      ],
      group: [`Course.id`],
    });

    res.send(paginateResults({ count, limit, skip, rows }));
  } catch (error) {
    return res.boom.serverUnavailable();
  }
}

async function get(req, res) {
  try {
    const course = await Course.findOne({
      where: { id: req.params.courseId },
      attributes: [`id`, `code`, `name`],
    });

    if (!course) {
      return res.boom.notFound(`No course with that id`);
    }

    return res.status(200).send(course);
  } catch (error) {
    return res.boom.serverUnavailable();
  }
}

async function create(req, res) {
  try {
    const course = await Course.create({
      code: req.body.code,
      name: req.body.name,
    });

    return res.send(course);
  } catch (error) {
    switch (error.name) {
      case `SequelizeValidationError`:
        return res.boom.badData(``, {
          errors: error.errors.map(a => a.message),
        });
      default:
        return res.boom.serverUnavailable();
    }
  }
}

async function listReviewedLecturers(req, res) {
  const courseId = req.params.courseId;
  const valid = validateParams(req, res);

  if (!valid) {
    return;
  }

  const { limit, skip } = valid;

  try {
    const { count, rows } = await Lecturer.findAndCountAll({
      limit,
      offset: skip,
      subQuery: false,
      include: [
        {
          model: Review,
          as: `reviews`,
          attributes: [],
          required: true,
          include: [
            {
              model: Course,
              where: {
                id: courseId,
              },
              attributes: [],
            },
          ],
        },
        {
          model: School,
          attributes: [`name`],
        },
      ],
      attributes: [
        `id`,
        `name`,
        [fn(`COUNT`, col(`reviews.id`)), `totalReviews`],
        [fn(`AVG`, col(`reviews.rating`)), `averageRating`],
      ],
      group: [`reviews.courseId`, `reviews.lecturerId`],
      order: [
        [literal(`averageRating`), `DESC`],
        [literal(`totalReviews`), `DESC`],
      ],
    });

    res.send(paginateResults({ count, limit, skip, rows }));
  } catch (error) {
    return res.boom.serverUnavailable();
  }
}

module.exports = {
  list,
  get,
  create,
  listReviewedLecturers,
};
