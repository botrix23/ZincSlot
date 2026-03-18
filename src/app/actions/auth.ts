"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Mock login que simula la validación de credenciales y establece una cookie de sesión.
 */
export async function loginAction(formData: FormData, locale: string) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  // Validación básica (MOCK)
  if (email === "admin@zyncslot.com" && password === "admin123") {
    // Establecer una cookie de sesión ficticia
    cookies().set("zync_session", JSON.stringify({ email, role }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 día
      path: "/",
    });

    return { success: true };
  }

  return { success: false, error: "Credenciales inválidas" };
}

/**
 * Logout: elimina la cookie y redirige.
 */
export async function logoutAction(locale: string) {
  cookies().delete("zync_session");
  redirect(`/${locale}/admin/login`);
}
