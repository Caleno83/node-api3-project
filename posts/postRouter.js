const express = require('express');
const postModel = require("../posts/postDb");

const router = express.Router();

router.get('/', (req, res) => {
  // do your magic!
  postModel
  .get()
  .then((post) => {
    res.status(200).json(post);
  })
  .catch((error) => {
    next(error);
  });
});

router.get('/:id', validatePostId(), (req, res) => {
  // do your magic!
  res.status(200).json(req.post)
});

router.delete('/:id', validatePostId(), (req, res) => {
  // do your magic!
  postModel
    .remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({
          message: "The post has been nuked",
        });
      } else {
        res.status(404).json({
          message: "The post could not be found",
        });
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.put('/:id', validatePostId(), validatePost(), (req, res) => {
  // do your magic!
  postModel
    .update(req.params.id, req.body)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "The post could not be found",
        });
      }
    })
    .catch((error) => {
      next(error);
    });
});

// custom middleware

function validatePostId() {
  // do your magic!
  return (req, res, next) => {
    postModel
      .getById(req.params.id)
      .then((post) => {
        if (post) {
          req.post = post;
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
