import {
  createUser,
  deleteUser,
  findUserByEmail,
  findUserById,
  updateUser,
  upsertUser,
} from '@repositories/user.repository.js';
import { ApiError } from '@utils/apiError.js';
import { ERROR_CODES } from '@utils/errorCodes.js';
import { User } from '@generated/prisma/client.js';

type ClerkEmailAddress = {
  email_address: string;
};

export type ClerkWebhookUserPayload = {
  id: string;
  email_addresses?: ClerkEmailAddress[];
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string | null;
};

type ClerkWebhookUserIdentifier = Pick<ClerkWebhookUserPayload, 'id'>;

export const getUserDetailsService = async (userId: string): Promise<User> => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, ERROR_CODES.USER_NOT_FOUND);
  }

  return user;
};

export const handleUserCreated = async (data: ClerkWebhookUserPayload) => {
  const email = data.email_addresses?.[0]?.email_address ?? '';
  const existingUser = await findUserByEmail(email);

  const userData = {
    ...(data.first_name && { firstName: data.first_name }),
    ...(data.last_name && { lastName: data.last_name }),
    ...(data.image_url && { imageUrl: data.image_url }),
  };

  if (existingUser) {
    return updateUser(existingUser.clerkUserId, {
      clerkUserId: data.id,
      ...userData,
    });
  } else {
    return createUser({
      clerkUserId: data.id,
      email,
      ...userData,
    });
  }
};

export const handleUserUpdated = async (data: ClerkWebhookUserPayload) => {
  const userData = {
    email: data.email_addresses?.[0]?.email_address ?? '',
    ...(data.first_name && { firstName: data.first_name }),
    ...(data.last_name && { lastName: data.last_name }),
    ...(data.image_url && { imageUrl: data.image_url }),
  };

  return upsertUser(data.id, userData);
};

export const handleUserDeleted = async (
  data: Partial<ClerkWebhookUserIdentifier>
) => {
  if (!data.id) {
    console.warn('Received user.deleted webhook without an id, skipping.');
    return;
  }

  try {
    await deleteUser(data.id);
  } catch {
    console.warn(
      `Failed to delete user with clerkUserId ${data.id}. It may not exist.`
    );
  }
};
