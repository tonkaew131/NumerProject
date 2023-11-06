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

	let users;
	try {
		users = await prisma.user.findMany({
			select: {
				id: true,
				google_name: true,
				google_profile: true
			}
		});
	} catch (error) {
		return json({
			status: 'error',
			error: {
				message: `Something went wrong!, please try again later. If the problem persists, please contact @tonkaew131`
			}
		});
	}

	return json(
		{
			status: 'success',
			data: {
				users
			}
		},
		{
			headers: {
				'Cache-Control': 'public, s-maxage=60'
			}
		}
	);
};
