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

router.get("/", (req, res) => {
  // do your magic!
  userModel
    .get()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/:id", validateUserId(), (req, res) => {
  // do your magic!
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId(), (req, res) => {
  // do your magic!
  userModel
    .getUserPosts(req.params.id)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      next(error);
    });
});

router.delete("/:id", validateUserId(), (req, res) => {
  // do your magic!
  userModel
    .remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({
          message: "The user has been nuked",
        });
      } else {
        res.status(404).json({
          message: "The user could not be found",
        });
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.put("/:id", validateUser(), validateUserId(), (req, res) => {
  // do your magic!
  userModel
    .update(req.params.id, req.body)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          message: "The user could not be found",
        });
      }
    })
    .catch((error) => {
      next(error);
    });
});

//custom middleware

function validateUserId() {
  // do your magic!
  return (req, res, next) => {
    userModel
      .getById(req.params.id)
      .then((user) => {
        if (user) {
          req.user = user;
          next();
        } else {
          res.status(400).json({
            message: "Invalid user id",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: "Error retrieving the user",
        });
      });
  };
}

function validateUser() {
  // do your magic!
  return (req, res, next) => {
    if (!req.body) {
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
    if (!req.body) {
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
