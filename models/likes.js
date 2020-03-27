"use strict";
module.exports = (sequelize, DataTypes) => {
  const likes = sequelize.define(
    "likes",
    {
      storyId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER
    },
    {}
  );
  likes.associate = function(models) {
    likes.belongsTo(models.user);
    likes.belongsTo(models.story);
  };
  return likes;
};
