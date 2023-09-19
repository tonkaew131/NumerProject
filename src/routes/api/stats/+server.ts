import { prisma } from '$lib/server/prisma';

import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const userCount = await prisma.user.count();

	const totalProblems: {
		executed_time: number;
		solved_count: number;
	}[] = await prisma.$queryRaw`SELECT 
			SUM(executed_time * solved_count) AS executed_time,
			SUM(solved_count) AS solved_count 
		FROM ProblemSolved`;

	const totalProblemSolved = totalProblems[0].solved_count || 0;
	const totalExecutedTime = totalProblems[0].executed_time || 0;

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

	return json({
		status: 'success',
		data: {
			userCount,
			totalProblemSolved: totalProblemSolved,
			totalExecutedTime: totalExecutedTime,
			mostRecentSolutions
		}
	});
};
