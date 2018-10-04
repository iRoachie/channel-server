'use strict';

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      `Releases`,
      [
        {
          title: `October/November 2017`,
          cover: `https://f001.backblazeb2.com/file/uscchannel/releases/october-november-2017/cover.jpg`,
          magazine: `https://f001.backblazeb2.com/file/uscchannel/releases/october-november-2017/magazine.pdf`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: `November/December 2016`,
          cover: `https://f001.backblazeb2.com/file/uscchannel/releases/november-december-2016/cover.jpg`,
          magazine: `https://f001.backblazeb2.com/file/uscchannel/releases/november-december-2016/magazine.pdf`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete(`Releases`, null, {});
  },
};
