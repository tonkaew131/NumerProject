import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();

	return {
		user: session.user
	};
}) satisfies PageServerLoad;
