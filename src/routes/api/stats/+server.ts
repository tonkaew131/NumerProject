import { prisma } from '$lib/server/prisma';

import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const userCount = await prisma.user.count();
	const totalProblems = await prisma.problemSolved.aggregate({
		_sum: {
			executed_time: true,
			solved_count: true
		}
	});

	console.log(totalProblems);
	// const userCount = 2;

	await new Promise((resolve) => setTimeout(resolve, 1000));

	return json({
		status: 'success',
		data: {
			userCount,
			totalProblemSolved: totalProblems._sum?.solved_count
		}
	});
};
