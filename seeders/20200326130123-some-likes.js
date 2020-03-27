"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "likes",
      [
        {
          storyId: 1,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          storyId: 2,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          storyId: 1,
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          storyId: 3,
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("likes", null, {});
  }
};
