import { json } from '@sveltejs/kit';

// import { dev } from '$app/environment';
import { prisma } from '$lib/server/prisma';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	// if (dev) {
	// 	return json({
	// 		status: 'success',
	// 		data: {
	// 			users: []
	// 		}
	// 	});
	// }

	let users: {
		id: number;
		google_name: string;
		google_email: string;
		google_profile: string;
		problem_type: string;
		solution_count: number;
	}[];
	try {
		users = await prisma.$queryRaw`
			SELECT
				User.id AS id,
				User.google_name AS google_name,
				User.google_email AS google_email,
				User.google_profile AS google_profile,
				Problem.problem_type AS problem_type,
				COUNT(Problem.id) AS solution_count
			FROM User
				LEFT JOIN Problem ON User.id = Problem.user_id
			GROUP BY User.id, User.google_name, User.google_email, Problem.problem_type
			ORDER BY User.id, Problem.problem_type;
		`;
	} catch (error) {
		console.error(error);
		return json({
			status: 'error',
			error: {
				message: `Something went wrong!, please try again later. If the problem persists, please contact @tonkaew131`
			}
		});
	}

	const formattedUsers: {
		[id: number]: {
			id: number;
			google_name: string;
			google_email: string;
			google_profile: string;
			solutions: {
				[solutionType: string]: number;
			};
		};
	} = {};
	for (let i = 0; i < users.length; i++) {
		if (users[i].id in formattedUsers) {
			formattedUsers[users[i].id].solutions[users[i].problem_type] = Number(
				users[i].solution_count
			);
			continue;
		}

		formattedUsers[users[i].id] = {
			id: users[i].id,
			google_name: users[i].google_name,
			google_email: users[i].google_email,
			google_profile: users[i].google_profile,
			solutions: {
				[users[i].problem_type]: Number(users[i].solution_count)
			}
		};
	}

	return json(
		{
			status: 'success',
			data: {
				users: Object.values(formattedUsers)
			}
		},
		{
			headers: {
				'Cache-Control': 'public, s-maxage=60'
			}
		}
	);
};
