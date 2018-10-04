const paginateResults = ({ count, limit, skip, rows }) => {
  /**
   * Necessary because of https://github.com/sequelize/sequelize/issues/6148
   */
  const realCount = count.length;

  const response = {
    pageInfo: {
      totalResults: realCount,
      resultsPerPage: limit,
      skip,
    },
  };

  if (realCount - (skip + limit) > 0) {
    response.pageInfo.nextSkip = skip + limit;
  }

  response.results = rows;

  return response;
};

module.exports = {
  paginateResults,
};
