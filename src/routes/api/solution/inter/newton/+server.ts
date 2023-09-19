import { json } from '@sveltejs/kit';

import { newtonDividedDifference } from '$lib/solutions/newtonDivided';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const dataJson = await request.json();

	const { points, selected_point, x } = dataJson;
	const selectedPoint = selected_point;

	if (!points || !selectedPoint || !x) {
		return json(
			{
				status: 'error',
				error: {
					message: 'Points, Selected Point and X is required!'
				}
			},
			{
				status: 400
			}
		);
	}

	if (points.length < 2) {
		return json(
			{
				status: 'error',
				error: {
					message: 'At least 2 points is required!'
				}
			},
			{
				status: 400
			}
		);
	}

	// check all points is valid

	const newPoints = [];
	for (const point of points) {
		if (typeof point.x != 'number' || typeof point.y != 'number') {
			return json(
				{
					status: 'error',
					error: {
						message: 'Invalid point!'
					}
				},
				{
					status: 400
				}
			);
		}

		newPoints.push({
			x: point.x,
			y: point.y
		});
	}

	for (const x of selectedPoint) {
		if (typeof x != 'number') {
			return json(
				{
					status: 'error',
					error: {
						message: 'Invalid x!'
					}
				},
				{
					status: 400
				}
			);
		}

		if (!newPoints.find((p) => p.x == x)) {
			return json(
				{
					status: 'error',
					error: {
						message: 'Invalid selected point!'
					}
				},
				{
					status: 400
				}
			);
		}
	}

	const result = newtonDividedDifference(newPoints, selectedPoint, x);
	// console.log(result);

	return json({
		status: 'success',
		data: result
	});
};
