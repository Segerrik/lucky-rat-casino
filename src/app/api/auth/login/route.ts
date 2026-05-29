import { prisma } from '@/lib/prisma';
import { createToken, setSessionCookie, verifyPassword } from '@/lib/auth';
import { jsonError, jsonOk, sanitizeUser } from '@/lib/api-utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) return jsonError('Email and password are required');

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || user.isBlocked) return jsonError('Invalid credentials', 401);

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) return jsonError('Invalid credentials', 401);

    const token = await createToken({ userId: user.id, email: user.email, role: user.role });
    await setSessionCookie(token);

    return jsonOk({ user: sanitizeUser(user) });
  } catch {
    return jsonError('Login failed', 500);
  }
}
