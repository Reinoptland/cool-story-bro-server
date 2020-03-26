const { Router } = require("express");
const auth = require("../auth/middleware");
const Homepage = require("../models").homepage;
const Story = require("../models").story;
const User = require("../models").user;
const Likes = require("../models").likes;

const router = new Router();

router.patch("/:id", auth, async (req, res) => {
  const homepage = await Homepage.findByPk(req.params.id);
  if (!homepage.userId === req.user.id) {
    return res
      .status(403)
      .send({ message: "You are not authorized to update this homepage" });
  }

  const { title, description, backgroundColor, color } = req.body;

  await homepage.update({ title, description, backgroundColor, color });

  return res.status(200).send({ homepage });
});

router.post("/:id/stories", auth, async (req, res) => {
  const homepage = await Homepage.findByPk(req.params.id);
  console.log(homepage);

  if (homepage === null) {
    return res.status(404).send({ message: "This homepage does not exist" });
  }

  if (!homepage.userId === req.user.id) {
    return res
      .status(403)
      .send({ message: "You are not authorized to update this homepage" });
  }

  const { name, imageUrl, content } = req.body;

  if (!name) {
    return res.status(400).send({ message: "A story must have a name" });
  }

  const story = await Story.create({
    name,
    imageUrl,
    content,
    homepageId: homepage.id
  });

  return res.status(201).send({ message: "Story created", story });
});

router.post("/stories/:storyId/like", auth, async (req, res, next) => {
  // Add a row to the likes table with storyId and userId;
  const { storyId } = req.params;
  const userId = req.user.id;

  // First check if this userId-storyId combo exists.
  // if exists -> destroy (unlike)
  // if not -> create (like);
  try {
    const liked = await Likes.create({ userId, storyId });
    console.log("liked post?", liked);
    res.json({ storyId, userId });
  } catch (e) {
    next(e);
  }
});

router.delete("/:homepageId/stories/:storyId", auth, async (req, res, next) => {
  // get the storyId from params
  const { storyId } = req.params;
  try {
    const story = await Story.findByPk(storyId);
    console.log("HEEEYYYYYY IM DELETINGGG");
    // check if the story exists => if not 404
    if (!story) {
      return res.status(404).send("Story not found");
    }

    console.log("The story exists");
    // if exists we are gonna delete it
    const result = await story.destroy();

    console.log("story deleted", result);
    // send back the deleted id.
    res.json({ storyId });
  } catch (e) {
    next(e);
  }
});

router.get("/", async (req, res) => {
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;
  const homepages = await Homepage.findAndCountAll({
    limit,
    offset,
    include: [
      { model: Story, include: [{ model: User, attributes: ["id", "name"] }] }
    ],
    order: [[Story, "createdAt", "DESC"]]
  });
  res.status(200).send({ message: "ok", homepages });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  console.log(id);
  if (isNaN(parseInt(id))) {
    return res.status(400).send({ message: "Homepage id is not a number" });
  }

  const homepage = await Homepage.findByPk(id, {
    include: [
      { model: Story, include: [{ model: User, attributes: ["id", "name"] }] }
    ],
    order: [[Story, "createdAt", "DESC"]]
  });

  if (homepage === null) {
    return res.status(404).send({ message: "Homepage not found" });
  }

  res.status(200).send({ message: "ok", homepage });
});

module.exports = router;
