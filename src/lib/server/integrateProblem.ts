import { trapezoidalRule } from '$lib/solutions/trapezoidalRule';

import { generateId } from '../utils';
import { prisma } from './prisma';
import { Problem, ProblemSolver } from './problem';

export class IntegrateProblem extends Problem {
	constructor(input: string) {
		super(input, 'INTEGRATION');
	}

	formatInput(): [
		null | { xStart: number; xEnd: number; func: string; n: number },
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

		const { xStart, xEnd, func, n } = dataJson;

		if (xStart == null || isNaN(xStart)) {
			return [
				null,
				{
					message: 'a (xStart) is required!',
					status: 400
				}
			];
		}

		if (xEnd == null || isNaN(xEnd)) {
			return [
				null,
				{
					message: 'b (xEnd) is required!',
					status: 400
				}
			];
		}
		const newXStart = Number(xStart);
		const newXEnd = Number(xEnd);

		if (n == null || isNaN(n)) {
			return [
				null,
				{
					message: 'n is required!',
					status: 400
				}
			];
		}
		const newN = Number(n);

		const newData = {
			xStart: newXStart,
			xEnd: newXEnd,
			func: func,
			n: newN
		};

		this.input = JSON.stringify(newData);
		return [newData, null];
	}

	async getProblemId(
		mode: 'select' | 'create' = 'select'
	): Promise<[null | string | undefined, null | { message: string; status: number }]> {
		if (this.problemId != undefined) return [this.problemId, null];

		const { xStart, xEnd, func, n } = JSON.parse(this.input);

		let problem;
		try {
			problem = await prisma.problem.findFirst({
				where: {
					AND: [
						{
							input: {
								path: '$.xStart',
								equals: xStart
							}
						},
						{
							input: {
								path: '$.xEnd',
								equals: xEnd
							}
						},
						{
							input: {
								path: '$.func',
								equals: func
							}
						},
						{
							input: {
								path: '$.n',
								equals: n
							}
						},
						{
							problem_type: 'INTEGRATION'
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
						problem_type: 'INTEGRATION',
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

export class TrapezoidalRuleSolver extends ProblemSolver {
	constructor(problem: Problem) {
		super(problem, 'TRAPEZOIDAL_RULE');
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
			const output = trapezoidalRule(input.xStart, input.xEnd, input.func, input.n);
			const endTime = Date.now(); // ms

			this.problemSolverId = generateId();
			await prisma.problemSolved.create({
				data: {
					id: this.problemSolverId,
					output: JSON.parse(JSON.stringify(output)),
					solution_type: 'TRAPEZOIDAL_RULE',
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
