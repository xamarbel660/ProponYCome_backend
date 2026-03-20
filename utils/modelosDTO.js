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

const singleFamiliaDTO = (familia) => {
  // Si el usuario es null o undefined, devolvemos null para no romper nada
  if (!familia) return null
  // Nunca, bajo ninguna circunstancia, devuelvas la contraseña ni el hash de la contraseña en esta respuesta.
  return {
    // Mapeamos los campos que SÍ queremos enviar
    nombre_familia: familia.nombre_familia,
    codigo_invitacion: familia.codigo_invitacion
  }
}

/**
 * Lista de familias
 */
const multipleFamiliaDTO = (familias) => {
  if (!familias || !Array.isArray(familias)) return []
  // Reutilizamos la función individual para cada familia de la lista
  return familias.map((familia) => singleFamiliaDTO(familia))
}

module.exports = { singleUserDTO, singleFamiliaDTO, multipleFamiliaDTO }
