import { prisma } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const userCount = await prisma.user.count();

	return json({
		status: 'success',
		data: {
			userCount
		}
	});
};
