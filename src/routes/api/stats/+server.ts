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

	// console.log(totalProblems);
	// await new Promise((resolve) => setTimeout(resolve, 1000));

	const mostRecentSolutions = await prisma.problemSolved.findMany({
		take: 5,
		orderBy: {
			solved_at: 'desc'
		},
		include: {
			solved_by: true,
			problem: true
		}
	});

	// console.log(mostRecentSolutions)

	return json({
		status: 'success',
		data: {
			userCount,
			totalProblemSolved: totalProblems._sum?.solved_count || 0,
			totalExecutedTime: totalProblems._sum?.executed_time || 0,
			mostRecentSolutions
		}
	});
};
