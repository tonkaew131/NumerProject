import { PrismaClient } from '@prisma/client';
import { env } from '$env/dynamic/private';

const prisma: PrismaClient = global.__prisma || new PrismaClient();

if (env.NODE_ENV === 'development') {
	global.__prisma = prisma;
}

export async function handleError<T>(
	callback: () => Promise<T>
): Promise<[T | null, Error | null]> {
	try {
		const result = await callback();
		return [result, null];
	} catch (error) {
		return [
			null,
			{
				name: 'e',
				message: 'a'
			}
		];
	}
}

export { prisma };
