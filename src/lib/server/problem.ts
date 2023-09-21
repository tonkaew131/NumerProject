import { generateId } from '../utils';
import { prisma } from './prisma';

abstract class Problem {
	protected problemId?: string;
	protected userId?: string;
	protected problemType: ProblemType;
	protected input: string;

	constructor(input: string, problemType: ProblemType) {
		this.input = input;
		this.problemType = problemType;
	}

	abstract getProblemId(
		mode: 'select' | 'create'
	): Promise<[null | string | undefined, null | { message: string; status: number }]>;
	abstract formatInput(): [null | object, null | { message: string; status: number }];

	setUserId(userId: string) {
		this.userId = userId;
	}
}

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

		return [problemId, null];
	}
}

class ProblemSolved {
	protected problemSolvedId?: string;
}

type ProblemType = 'INTERPOLATION' | 'DIFFERENTIATION' | 'INTEGRATION';
