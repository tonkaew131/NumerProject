import { prisma } from './server/prisma';

abstract class Problem {
	problemId?: string;
	problemType: ProblemType;
	input: string;

	constructor(input: string, problemType: ProblemType) {
		this.input = input;
		this.problemType = problemType;
	}

	abstract isExists(): Promise<boolean>;
	abstract formatInput(): [null | object, null | { message: string; status: number }];
}

export class InterpolationProblem extends Problem {
	constructor(input: string) {
		super(input, 'INTERPOLATION');
	}

	formatInput(): [null | object, null | { message: string; status: number }] {
		let dataJson;
		try {
			dataJson = JSON.parse(this.input);
		} catch (err) {
			return [
				null,
				{
					message: 'Invalid JSON!',
					status: 400
				}
			];
		}

		const { points, selected_point, x } = dataJson;
		const selectedPoint = selected_point;

		if (typeof points != 'object' || points == null) {
			return [
				null,
				{
					message: 'Points is required!',
					status: 400
				}
			];
		}

		if (typeof selectedPoint != 'object' || typeof selectedPoint == null) {
			return [
				null,
				{
					message: 'Selected Point is required!',
					status: 400
				}
			];
		}

		if (typeof x != 'number' || x == null) {
			return [
				null,
				{
					message: 'X is required!',
					status: 400
				}
			];
		}

		// if points is not array
		if (typeof points[Symbol.iterator] !== 'function') {
			return [
				null,
				{
					message: 'Points must be an array!',
					status: 400
				}
			];
		}

		// if selected point is not array
		if (typeof selectedPoint[Symbol.iterator] !== 'function') {
			return [
				null,
				{
					message: 'Selected Point must be an array!',
					status: 400
				}
			];
		}

		if (points.length < 2) {
			return [
				null,
				{
					message: 'At least 2 points is required!',
					status: 400
				}
			];
		}

		// check all points is valid
		const newPoints = [];
		for (const point of points) {
			if (typeof point.x != 'number' || typeof point.y != 'number') {
				return [
					null,
					{
						message: 'Invalid point!',
						status: 400
					}
				];
			}

			newPoints.push({
				x: point.x,
				y: point.y
			});
		}

		for (const x of selectedPoint) {
			if (typeof x != 'number') {
				return [
					null,
					{
						message: 'Invalid selected point!',
						status: 400
					}
				];
			}

			if (!newPoints.find((p) => p.x == x)) {
				return [
					null,
					{
						message: 'Invalid selected point!',
						status: 400
					}
				];
			}
		}

		const newData = {
			points: newPoints,
			selected_point: selectedPoint,
			x: x
		};

		this.input = JSON.stringify(newData);
		return [newData, null];
	}

	async isExists(): Promise<boolean> {
		const problem = await prisma.problem.findFirst({
			where: {
				AND: [
					{
						input: {
							path: '$.points',
							equals: newPoints
						}
					},
					{
						input: {
							path: '$.selected_point',
							equals: selectedPoint
						}
					},
					{
						input: {
							path: '$.x',
							equals: x
						}
					},
					{
						problem_type: 'INTERPOLATION'
					}
				]
			}
		});

		return true;
	}
}

// class ProblemSolved extends Problem {
// 	// ..
// }

type ProblemType = 'INTERPOLATION' | 'DIFFERENTIATION' | 'INTEGRATION';
