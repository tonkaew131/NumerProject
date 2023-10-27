import { json } from '@sveltejs/kit';

import { CLEAN_API_KEY } from '$env/static/private';
import { prisma } from '$lib/server/prisma';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	return json({ status: 'error', message: 'API Disabled' }, { status: 403 });

	// if (CLEAN_API_KEY.trim() == '') {
	// 	return json({ status: 'error', message: 'API Disabled' }, { status: 403 });
	// }

	// if (request.headers.get('api_key') != CLEAN_API_KEY) {
	// 	return json({ status: 'error', message: 'Invalid API Key' }, { status: 403 });
	// }

	// cleanDuplicationSolution();
	// cleanInvalidOutput();
	// cleanInvalidJson();

	// return json({ status: 'ok' });
};

async function cleanInvalidJson() {
	const solutions = await prisma.problemSolved.findMany({
		where: {
			OR: [
				{
					output: {
						string_contains: '\\"'
					}
				}
			]
		}
	});

	for (const sl of solutions) {
		const { id, output } = sl;
		console.log('updating', id, '...');
		try {
			await prisma.problemSolved.update({
				where: { id: id },
				data: {
					output: JSON.parse(output)
				}
			});
		} catch (error) {
			console.log('failed to update, id: ' + id + '\n' + error);
		}
	}
}

async function cleanInvalidOutput() {
	const solutions = await prisma.problemSolved.findMany({
		where: {
			OR: [
				{
					output: {
						string_contains: 'null'
					}
				}
			]
		}
	});
	// console.log(JSON.stringify(solutions));

	for (const sl of solutions) {
		const { id } = sl;
		console.log('deleting', id, '...');
		try {
			await prisma.problemSolved.delete({ where: { id: id } });
		} catch (error) {
			console.log('failed to delete, id: ' + id + '\n' + error);
		}
	}
}

async function cleanDuplicationSolution() {
	const solutions: { output: any }[] = await prisma.$queryRaw`
        SELECT COUNT(id), output
        FROM ProblemSolved 
        GROUP BY output
        HAVING COUNT(id) > 1
        ORDER BY COUNT(id) DESC;
    `;

	for (const sl of solutions) {
		const { output } = sl;
		const ids = await prisma.problemSolved.findMany({
			where: { output: { equals: output } },
			orderBy: { solved_count: 'desc' }
		});

		const problemId = ids[0].problem_id;

		let isCanceled = false;
		let totalSolve = 0;
		let totalView = 0;
		let totalExec = 0;
		for (const id of ids) {
			if (id.problem_id != problemId) {
				console.log('different problem same output');
				isCanceled = true;
				break;
			}
			totalSolve += id.solved_count;
			totalView += id.view_count;
			totalExec += id.executed_time;
		}

		if (isCanceled) {
			// for (const id of ids) {
			// 	console.log(id);
			// }
			continue;
		}

		const toDelete = ids.slice(1);
		// console.log(toDelete);

		for (const id of toDelete) {
			console.log('deleting', id.id, '...');
			try {
				await prisma.problemSolved.delete({ where: { id: id.id } });
			} catch (error) {
				console.log('failed to delete, id: ' + id + '\n' + error);
			}
		}

		try {
			await prisma.problemSolved.update({
				where: { id: ids[0].id },
				data: {
					solved_count: totalSolve,
					view_count: totalView,
					executed_time: totalExec / ids.length
				}
			});
		} catch (error) {
			console.log('failed to update, id: ' + ids[0].id + '\n' + error);
		}
	}
}
