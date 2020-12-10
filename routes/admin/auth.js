const express = require('express');

const { handleErrors } = require('./middlewares');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireValidPasswordForUser,
} = require('./validators');

const router = express.Router();

// Sign Up Get Route Handler
router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});
// Sign Up Post Route Hanlder
router.post(
  //
  '/signup',
  [requireEmail, requirePassword, requirePasswordConfirmation],
  handleErrors(signupTemplate),
  async (req, res) => {
    const { email, password } = req.body;
    const user = await usersRepo.create({ email, password });

    req.session.userId = user.id;

    res.redirect('admin/products');
  }
);

// SignOut Page Get Route Handler
router.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are logged out');
});

// Sign In Page Get Route Handler
router.get('/signin', (req, res) => {
  res.send(signinTemplate({}));
});

// Sign In Page Post Route Handler
router.post(
  '/signin', //
  [requireEmailExists, requireValidPasswordForUser],
  handleErrors(signinTemplate),
  async (req, res) => {
    const { email } = req.body;
    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id;

    res.redirect('admin/products');
  }
);

module.exports = router;
