const { story: Story, user: User } = require("./models");

Story.findAll({
  include: [{ model: User, attributes: ["id", "name"] }]
}).then(stories =>
  stories.map(story => console.log(story.get({ plain: true })))
);
