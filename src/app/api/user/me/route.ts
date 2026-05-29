import { requireUser, jsonOk, sanitizeUser } from '@/lib/api-utils';

export async function GET() {
  const { user, error } = await requireUser();
  if (error) return error;
  return jsonOk({ user: sanitizeUser(user!) });
}
