/**
 * DTO (Data Transfer Object) para Usuario.
 * Recibe el objeto crudo de la BD y devuelve solo lo que queremos mostrar.
 */
const singleUserDTO = (usuario) => {
  // Si el usuario es null o undefined, devolvemos null para no romper nada
  if (!usuario) return null
  // Nunca, bajo ninguna circunstancia, devuelvas la contraseña ni el hash de la contraseña en esta respuesta.
  return {
    // Mapeamos los campos que SÍ queremos enviar
    nombre: usuario.nombre,
    email: usuario.email
  }
}

/**
 * Helper para cuando tengas que devolver una lista de usuarios
 */
const multipleUserDTO = (usuario) => {
  if (!usuario || !Array.isArray(usuario)) return []
  // Reutilizamos la función individual para cada usuario de la lista
  return usuario.map((usuario) => singleUserDTO(usuario))
}

module.exports = { singleUserDTO, multipleUserDTO }
