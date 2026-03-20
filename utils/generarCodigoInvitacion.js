const crypto = require('crypto')

function generarCodigoInvitacion() {
  // Fíjate que no hay ni 'O', ni '0', ni 'I', ni '1'
  const caracteresValidos = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let codigo = ''

  // Generamos 6 caracteres aleatorios
  for (let i = 0; i < 6; i++) {
    const indiceAleatorio = crypto.randomInt(0, caracteresValidos.length)
    codigo += caracteresValidos[indiceAleatorio]
  }

  return codigo
}

module.exports = generarCodigoInvitacion
