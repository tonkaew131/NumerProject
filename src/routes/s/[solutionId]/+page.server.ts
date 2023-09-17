import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	return {
		solutionId: params.solutionId
	};
}) satisfies PageServerLoad;
