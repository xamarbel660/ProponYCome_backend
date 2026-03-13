const { body, validationResult } = require('express-validator')

const validarRegistro = [
  // Reglas
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('nombre')
    .isLength({ min: 4 })
    .withMessage('El nombre debe tener al menos 4 caracteres'),
  body('email').isEmail().withMessage('El email debe ser válido'),
  body('password_hash').notEmpty().withMessage('La contraseña es obligatoria'),
  body('password_hash')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres'),

  // Middleware que procesa las reglas
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      // Si hay error, RESPONDEMOS AQUÍ y cortamos el flujo.
      // El Controller y el Service NUNCA se ejecutan.
      return res.status(400).json({
        ok: false,
        datos: null,
        mensaje: 'Error al registrar al usuario',
        errors: errors.array()
      })
    }
    next() // Todo bien, pasa al Controller
  }
]

const validarLogin = [
  // Reglas
  body('email').isEmail().withMessage('El email debe ser válido'),
  body('password_hash').notEmpty().withMessage('La contraseña es obligatoria'),

  // Middleware que procesa las reglas
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      // Si hay error, RESPONDEMOS AQUÍ y cortamos el flujo.
      // El Controller y el Service NUNCA se ejecutan.
      return res.status(400).json({
        ok: false,
        datos: null,
        mensaje: 'Error al logear al usuario',
        errors: errors.array()
      })
    }
    next() // Todo bien, pasa al Controller
  }
]

module.exports = { validarRegistro, validarLogin }
