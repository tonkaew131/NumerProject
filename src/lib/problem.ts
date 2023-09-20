import { prisma } from './server/prisma';

class Problem {
	problemId?: string;
	problemType: ProblemType;
	input: string;

	constructor(input: string, problemType: ProblemType) {
		this.input = input;
		this.problemType = problemType;

		// const problem = await prisma.problem.findFirst({
		// 	where: {
		// 		AND: [
		// 			{
		// 				input: {
		// 					path: '$.points',
		// 					equals: newPoints
		// 				}
		// 			},
		// 			{
		// 				input: {
		// 					path: '$.selected_point',
		// 					equals: selectedPoint
		// 				}
		// 			},
		// 			{
		// 				input: {
		// 					path: '$.x',
		// 					equals: x
		// 				}
		// 			},
		// 			{
		// 				problem_type: 'INTERPOLATION'
		// 			}
		// 		]
		// 	}
		// });
	}
}

// class ProblemSolved extends Problem {
// 	// ..
// }

type ProblemType = 'INTERPOLATION' | 'DIFFERENTIATION' | 'INTEGRATION';
