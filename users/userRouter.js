const express = require("express");
const userModel = require("../users/userDb");
const postModel = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser(), (req, res) => {
  // do your magic!
  userModel
    .insert(req.body)
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((error) => {
      next(error);
    }); // a shorter way to call next with the error
});

router.post("/:id/posts", validatePost(), validateUserId(), (req, res) => {
  // do your magic!
  postModel
    .insert({ text: req.body.text, user_id: req.params.id })
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/", async (req, res) => {
  // do your magic!
  try {
    const user = await userModel.get();
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", validateUserId(), (req, res) => {
  // do your magic!
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId(), async (req, res) => {
  // do your magic!
  try {
    const user = await userModel.getUserPosts(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", validateUserId(), async (req, res) => {
  // do your magic!
  try {
    const user = await userModel.remove(req.params.id);

    if (user > 0) {
      res.status(200).json({
        message: "The user has been nuked",
      });
    } else {
      res.status(404).json({
        message: "The user could not be found",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id", validateUser(), validateUserId(), async (req, res) => {
  // do your magic!
  try {
    const user = await userModel.update(req.params.id, req.body);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({
        message: "The user could not be found",
      });
    }
  } catch (error) {
    next(error);
  }
});

//custom middleware

function validateUserId() {
  // do your magic!
  return async (req, res, next) => {
    try {
      const user = await userModel.getById(req.params.id);

      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({
          message: "Invalid user id",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the user",
      });
    }
  };
}

function validateUser() {
  // do your magic!
  return  (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      res.status(400).json({
        message: "missing user data",
      });
    } else if (!req.body.name) {
      res.status(400).json({
        message: "missing required name field",
      });
    } else {
      next();
    }
  };
}

function validatePost() {
  // do your magic!
  return (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      res.status(400).json({
        message: "missing post data",
      });
    } else if (!req.body.text) {
      res.status(400).json({
        message: "missing required text field",
      });
    }

    next();
  };
}

module.exports = router;
