const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validator').validate;
const {isAuthenticated} = require('../middleware/authenticate');

const dogsController = require('../controllers/dogs');



router.get('/', dogsController.getAll);

router.get(
  '/:id',
  [param('id').isMongoId().withMessage('El ID no es válido')],
  validate,
  dogsController.getOne
);

router.post('/', isAuthenticated,
  [
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('breed').notEmpty().withMessage('La raza es obligatoria'),
    body('age').isInt({ min: 0 }).withMessage('La edad debe ser un número entero positivo'),
    body('weightKg').isFloat({ min: 0 }).withMessage('El peso debe ser un número positivo'),
    body('vaccinated').isBoolean().withMessage('Vaccinated debe ser true o false'),
    body('microchipped').isBoolean().withMessage('Microchipped debe ser true o false'),
    body('owner.name').notEmpty().withMessage('El nombre del dueño es obligatorio'),
    body('owner.phone').isNumeric().withMessage('El teléfono del dueño debe ser un número').notEmpty().withMessage('El teléfono del dueño es obligatorio')
  ],
  validate,
  dogsController.createDog
);

router.put('/:id',isAuthenticated,
  [
    param('id').isMongoId().withMessage('El ID no es válido'),
    body('name').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
    body('breed').optional().notEmpty().withMessage('La raza no puede estar vacía'),
    body('age').optional().isInt({ min: 0 }).withMessage('La edad debe ser un número entero positivo'),
    body('weightKg').optional().isFloat({ min: 0 }).withMessage('El peso debe ser un número positivo'),
    body('vaccinated').optional().isBoolean().withMessage('Vaccinated debe ser true o false'),
    body('microchipped').optional().isBoolean().withMessage('Microchipped debe ser true o false'),
    body('owner.name').optional().notEmpty().withMessage('El nombre del dueño no puede estar vacío'),
    body('owner.phone').optional().notEmpty().withMessage('El teléfono del dueño no puede estar vacío')
  ],
  validate,
  dogsController.updateDog
);

router.delete('/:id',isAuthenticated,
  [param('id').isMongoId().withMessage('El ID no es válido')],
  validate,
  dogsController.deleteDog
);

module.exports = router;
