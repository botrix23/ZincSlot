import { cookies } from "next/headers";

export type SessionUser = {
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  tenantId?: string | null;
  userId?: string;
  impersonatedBy?: string;      // Email del Super Admin que está impersonando (en sesión del admin)
  impersonatedTenantId?: string; // ID del tenant que el SUPER_ADMIN está visitando
  impersonatedTenantName?: string; // Nombre del tenant (para el banner)
};

/**
 * Obtiene la sesión actual desde las cookies de forma segura en el servidor.
 */
export async function getSession(): Promise<SessionUser | null> {
  const sessionCookie = cookies().get("zync_session");
  if (!sessionCookie) return null;

  try {
    return JSON.parse(sessionCookie.value) as SessionUser;
  } catch (e) {
    return null;
  }
}
