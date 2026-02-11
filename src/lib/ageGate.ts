/** Nombre de la cookie de verificación de edad. Sin max-age = cookie de sesión (se borra al cerrar el navegador). */
export const AGE_VERIFIED_COOKIE = "ageVerified";

/** Marca como mayor de edad en sesión (cookie de sesión: al cerrar la página/navegador vuelve a preguntar). */
export function setAgeVerifiedSession(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AGE_VERIFIED_COOKIE}=1; path=/; SameSite=Lax`;
}
