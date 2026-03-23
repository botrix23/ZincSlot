"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from 'bcryptjs';
import { db } from "@/db";
import { tenants, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logAuditEvent } from "@/lib/audit";

/**
 * Genera un slug URL-safe a partir de un nombre de negocio.
 * Ej: "Zync Salón & Spa!" → "zync-salon-spa-a3f2"
 */
function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina tildes
    .replace(/[^a-z0-9\s-]/g, '')   // Solo alfanuméricos y guiones
    .trim()
    .replace(/\s+/g, '-')           // Espacios → guión
    .slice(0, 40);                  // Máximo 40 chars

  const suffix = Math.random().toString(36).slice(2, 6); // 4 chars aleatorios
  return `${base}-${suffix}`;
}

/**
 * Login: valida credenciales y establece cookie de sesión.
 */
export async function loginAction(formData: FormData, locale: string) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 1. Buscar usuario en la base de datos (con join al tenant para ver status)
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    with: {
      tenant: true
    }
  });

  if (!user) {
    return { success: false, error: "Credenciales inválidas" };
  }

  // 2. Verificar que el Tenant no esté suspendido o expirado
  if (user.role === 'ADMIN' && user.tenant) {
    if (user.tenant.status === 'SUSPENDED') {
      return { success: false, error: "Tu cuenta de negocio está suspendida. Contacta a soporte." };
    }
    if (user.tenant.status === 'TRIAL' && user.tenant.subscriptionExpiresAt) {
      const now = new Date();
      if (now > user.tenant.subscriptionExpiresAt) {
        return { success: false, error: "Tu período de prueba ha expirado. Por favor, realiza el pago para continuar." };
      }
    }
  }

  // 3. Comparar contraseñas hasheadas
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (isMatch) {
    cookies().set("zync_session", JSON.stringify({ 
      email: user.email, 
      role: user.role,
      userId: user.id,
      tenantId: user.tenantId 
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    await logAuditEvent({ action: 'LOGIN_SUCCESS', userId: user.id, tenantId: user.tenantId, details: { email: user.email } });
    return { success: true, role: user.role };
  }

  await logAuditEvent({ action: 'LOGIN_FAILED', details: { email } });
  return { success: false, error: "Credenciales inválidas" };
}

/**
 * Registro de nuevo negocio (Tenant) y su primer usuario Admin.
 */
export async function registerTenantAction(formData: FormData, locale: string) {
  const businessName = formData.get("businessName") as string;
  const adminName = formData.get("adminName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 0. Validaciones de Seguridad
  if (password.length < 8) {
    return { success: false, error: "La contraseña debe tener al menos 8 caracteres." };
  }
  if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
    return { success: false, error: "La contraseña debe incluir al menos una letra y un número." };
  }

  try {
    // 1. Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Generar slug único para la URL pública del booking
    const slug = generateSlug(businessName);

    // 3. Crear el Tenant en modo TRIAL (14 días)
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 14);

    const [newTenant] = await db.insert(tenants).values({
      name: businessName,
      slug,
      timezone: 'America/El_Salvador',
      status: 'TRIAL',
      subscriptionExpiresAt: expiration,
    }).returning();

    // 4. Crear el Usuario Admin vinculado al Tenant
    const [newAdmin] = await db.insert(users).values({
      tenantId: newTenant.id,
      name: adminName,
      email,
      password: hashedPassword,
      role: 'ADMIN',
    }).returning();

    // 5. Establecer sesión
    cookies().set("zync_session", JSON.stringify({ 
      email, 
      role: 'ADMIN',
      userId: newAdmin.id,
      tenantId: newTenant.id 
    }), {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    await logAuditEvent({ action: 'TENANT_REGISTERED', userId: newAdmin.id, tenantId: newTenant.id, details: { businessName, slug } });
    return { success: true, slug };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Error al registrar el negocio. ¿El correo ya existe?" };
  }
}

/**
 * Logout: elimina la cookie y redirige al login.
 */
export async function logoutAction(locale: string) {
  cookies().delete("zync_session");
  redirect(`/${locale}/admin/login`);
}
