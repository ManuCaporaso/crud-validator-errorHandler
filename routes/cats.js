const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validator').validate;

const catsController = require('../controllers/cats');



router.get('/', catsController.getAll);

router.get(
  '/:id',
  [param('id').isMongoId().withMessage('El ID no es válido')],
  validate,
  catsController.getOne
);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('age').isInt({ min: 0 }).withMessage('La edad debe ser un número entero positivo'),
    body('color').notEmpty().withMessage('El color es obligatorio'),
    body('indoor').isBoolean().withMessage('Es gato casero o callejero (indoor debe ser true o false)'),
  ],
  validate,
  catsController.createCat
);

router.put(
  '/:id',
  [
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('age').isInt({ min: 0 }).withMessage('La edad debe ser un número entero positivo'),
    body('color').notEmpty().withMessage('El color es obligatorio'),
    body('indoor').isBoolean().withMessage('Es gato casero o callejero (indoor debe ser true o false)'),
  ],
  validate,
  catsController.updateCat
);

router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('El ID no es válido')],
  validate,
  catsController.deleteCat
);

module.exports = router;
