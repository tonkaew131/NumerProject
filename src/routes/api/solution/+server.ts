import { prisma } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const solutionId = url.searchParams.get('solutionId');

	if (!solutionId) {
		return json(
			{
				status: 'error',
				error: {
					message: 'solutionId is required'
				}
			},
			{
				status: 400
			}
		);
	}

	const solution = await prisma.problemSolved.findFirst({
		where: {
			id: solutionId
		}
	});

	if (!solution) {
		return json(
			{
				status: 'error',
				error: {
					message: 'solution not found'
				}
			},
			{
				status: 404
			}
		);
	}

	await prisma.problemSolved.update({
		where: {
			id: solutionId
		},
		data: {
			view_count: {
				increment: 1
			}
		}
	});

	return json({
		status: 'success',
		data: solution
	});
};
