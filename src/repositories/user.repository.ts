import prisma from '@lib/prisma.js';
import { User } from 'src/generated/prisma/client.js';

export const findUserById = async (userId: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id: userId },
  });
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { email } });
};

export const createUser = async (data: {
  clerkUserId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}) => {
  return prisma.user.create({
    data: {
      clerkUserId: data.clerkUserId,
      email: data.email,
      ...(data.firstName && { firstName: data.firstName }),
      ...(data.lastName && { lastName: data.lastName }),
      ...(data.imageUrl && { imageUrl: data.imageUrl }),
    },
  });
};

export const updateUser = async (
  clerkUserId: string,
  data: Partial<{
    clerkUserId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
  }>
) => {
  return prisma.user.update({
    where: { clerkUserId },
    data: {
      ...(data.clerkUserId && { clerkUserId: data.clerkUserId }),
      ...(data.email && { email: data.email }),
      ...(data.firstName && { firstName: data.firstName }),
      ...(data.lastName && { lastName: data.lastName }),
      ...(data.imageUrl && { imageUrl: data.imageUrl }),
    },
  });
};

export const upsertUser = async (
  clerkUserId: string,
  data: {
    email: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
  }
) => {
  return prisma.user.upsert({
    where: { clerkUserId },
    update: {
      ...(data.email && { email: data.email }),
      ...(data.firstName && { firstName: data.firstName }),
      ...(data.lastName && { lastName: data.lastName }),
      ...(data.imageUrl && { imageUrl: data.imageUrl }),
    },
    create: {
      clerkUserId,
      email: data.email,
      ...(data.firstName && { firstName: data.firstName }),
      ...(data.lastName && { lastName: data.lastName }),
      ...(data.imageUrl && { imageUrl: data.imageUrl }),
    },
  });
};

export const deleteUser = async (clerkUserId: string) => {
  return prisma.user.delete({ where: { clerkUserId } });
};
