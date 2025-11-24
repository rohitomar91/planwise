'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/prisma';

const serializeTransaction = (transaction) => {
  const serialized = { ...transaction };

  if (transaction.balance) {
    serialized.balance = transaction.balance.toNumber();
  }

  if (transaction.amount) {
    serialized.amount = transaction.amount.toNumber();
  }

  return serialized;
};

export async function createAccount(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('User not authenticated');

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error('User not found');

    // convert balance to float before saving
    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) throw new Error('Invalid balance value');

    //  check if this is user's first account
    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });

    const shouldBeDefault =
      existingAccounts.length === 0 ? true : data.isDefault;

    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const account = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault,
      },
    });

    const serializedAccount = serializeTransaction(account);

    revalidatePath('/dashboard');

    return { success: true, account: serializedAccount };
  } catch (error) {
    console.error('Error creating account:', error);
    throw new Error('Failed to create account');
  }
}

export async function getUserAccounts() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('User not authenticated');

    const user = await db.user?.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error('User not found');

    const accounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });
    const serializedAccounts = accounts.map(serializeTransaction);
    return serializedAccounts;
  } catch (error) {
    console.error('Error while fetching user accounts:', error);
    throw new Error('Failed to fetch user accounts');
  }
}
