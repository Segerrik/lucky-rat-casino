import { prisma } from '@/lib/prisma';
import { createToken, hashPassword, setSessionCookie } from '@/lib/auth';
import { jsonError, jsonOk, sanitizeUser } from '@/lib/api-utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, username } = body as {
      email?: string;
      password?: string;
      username?: string;
    };

    if (!email || !password || !username) {
      return jsonError('Email, username and password are required');
    }
    if (password.length < 6) {
      return jsonError('Password must be at least 6 characters');
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) return jsonError('Email already registered', 409);

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        username,
      },
    });

    const token = await createToken({ userId: user.id, email: user.email, role: user.role });
    await setSessionCookie(token);

    return jsonOk({ user: sanitizeUser(user) }, 201);
  } catch {
    return jsonError('Registration failed', 500);
  }
}
