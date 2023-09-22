import { newtonDividedDifference } from '$lib/solutions/newtonDivided';

import { generateId } from '../utils';
import { prisma } from './prisma';
import { Problem, ProblemSolver } from './problem';

export class InterpolationProblem extends Problem {
	constructor(input: string) {
		super(input, 'INTERPOLATION');
	}

	formatInput(): [
		null | { points: { x: number; y: number }[]; selected_point: number[]; x: number },
		null | { message: string; status: number }
	] {
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

		if (x == null || isNaN(x)) {
			return [
				null,
				{
					message: 'X is required!',
					status: 400
				}
			];
		}

		const newX = Number(x);
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
			x: newX
		};

		this.input = JSON.stringify(newData);
		return [newData, null];
	}

	async getProblemId(
		mode: 'select' | 'create' = 'select'
	): Promise<[null | string | undefined, null | { message: string; status: number }]> {
		if (this.problemId != undefined) return [this.problemId, null];

		const { points, selected_point, x } = JSON.parse(this.input);

		let problem;
		try {
			problem = await prisma.problem.findFirst({
				where: {
					AND: [
						{
							input: {
								path: '$.points',
								equals: points
							}
						},
						{
							input: {
								path: '$.selected_point',
								equals: selected_point
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
		} catch (err) {
			return [null, { message: 'Something went wrong!', status: 500 }];
		}

		let problemId = problem?.id;
		if (mode == 'create' && !problem) {
			problemId = generateId();
			try {
				await prisma.problem.create({
					data: {
						id: problemId,
						problem_type: 'INTERPOLATION',
						input: JSON.parse(this.input),
						user_id: this.userId
					}
				});
			} catch (err) {
				return [null, { message: 'Something went wrong!', status: 500 }];
			}
		}

		this.problemId = problemId;
		return [problemId, null];
	}
}

export class NewtonDividedDifferenceSolver extends ProblemSolver {
	constructor(problem: Problem) {
		super(problem, 'NEWTON_DIVIDED_DIFFERENCE');
	}

	async getOutput(): Promise<[object | null, { message: string; status: number } | null]> {
		const [solverId, solverIdError] = await this.getProblemSolverId();
		if (solverIdError) return [null, solverIdError];

		const [problemId, problemIdError] = await this.problem.getProblemId('select');
		if (problemIdError) return [null, problemIdError];
		if (!problemId) return [null, { message: 'Something went wrong!', status: 500 }];

		if (solverId == undefined) {
			const input = JSON.parse(this.problem.getInput());
			const startTime = Date.now(); // ms
			const output = newtonDividedDifference(input.points, input.selected_point, input.x);
			const endTime = Date.now(); // ms

			this.problemSolverId = generateId();
			await prisma.problemSolved.create({
				data: {
					id: this.problemSolverId,
					output: JSON.parse(JSON.stringify(output)),
					solution_type: 'NEWTON_DIVIDED_DIFFERENCE',
					executed_time: endTime - startTime,
					user_id: this.userId,
					problem_id: problemId,
					iteration_count: 0
				}
			});
			return [output, null];
		}

		await prisma.problemSolved.update({
			where: {
				id: this.problemSolverId
			},
			data: {
				solved_count: {
					increment: 1
				}
			}
		});

		if (this.output != undefined) return [JSON.parse(this.output), null];
		return [null, { message: 'Something went wrong!', status: 500 }];
	}
}
