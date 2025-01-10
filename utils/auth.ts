import cookie from "js-cookie";

export function getUserFromCookie() {
  const userCookie = cookie.get('login');
  if (userCookie && userCookie !== 'false') {
    try {
      const userData = JSON.parse(userCookie);
      return userData.usuario;
    } catch (error) {
      console.error('Error parsing user cookie:', error);
    }
  }
  return null;
}

export function getUserIdFromCookie(): string | null {
  const user = getUserFromCookie();
  return user ? user.idUsuario.toString() : null;
}

export function logout() {
  cookie.remove('login');
  // Eliminar cualquier otro dato de sesión si es necesario
}

