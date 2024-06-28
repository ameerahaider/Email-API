const express = require('express');
const userController = require('../controllers/userController');
const { param, body, validationResult} = require('express-validator');

const router = express.Router();

// Validation chains
const emailChain = () => body('email').trim().notEmpty().isEmail();

// Middleware to handle validation errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.post('/signup', [
    emailChain().withMessage('Invalid email'),
    validate
], userController.createUser);

router.post('/sendEmails', userController.sendEmails);

router.get('/failedEmails', userController.seefailedEmail);


module.exports = router;
