import { prisma } from './prisma';

export abstract class Problem {
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

	getInput() {
		return this.input;
	}
}

export abstract class ProblemSolver {
	protected problemSolverId?: string;
	protected solutionType: SolutionType;
	protected userId?: string;
	protected problem: Problem;
	protected output?: string;

	constructor(problem: Problem, solutionType: SolutionType) {
		this.problem = problem;
		this.solutionType = solutionType;
	}

	abstract getOutput(): Promise<[object | null, { message: string; status: number } | null]>;

	setUserId(userId: string) {
		this.userId = userId;
	}

	async getProblemSolverId(): Promise<
		[null | string | undefined, null | { message: string; status: number }]
	> {
		const [problemId, problemIdError] = await this.problem.getProblemId('select');
		if (problemIdError) return [null, problemIdError];
		if (!problemId) return [null, { message: 'Something went wrong!', status: 500 }];

		const problemSolution = await prisma.problemSolved.findFirst({
			where: {
				problem_id: problemId,
				solution_type: this.solutionType
			}
		});

		if (problemSolution != null) {
			this.output = JSON.stringify(problemSolution.output);
		}

		this.problemSolverId = problemSolution?.id;
		return [problemSolution?.id, null];
	}
}

type ProblemType =
	| 'ROOT_OF_EQUATION'
	| 'LINEAR_ALGEBRA_EQUATION'
	| 'INTERPOLATION'
	| 'EXTRAPOLATION'
	| 'INTEGRATION'
	| 'DIFFERENTIATION';
type SolutionType =
	| 'GRAPHICAL'
	| 'BISECTION'
	| 'FALSE_POSITION'
	| 'ONE_POINT_ITERATION'
	| 'NEWTON_RAPHSON'
	| 'SECANT'
	| 'CRAMER'
	| 'GUASS'
	| 'GUASS_JORDAN'
	| 'MATRIX_INVERSION'
	| 'NEWTON_DIVIDED_DIFFERENCE'
	| 'LANGRAGE_INTERPOLATION'
	| 'SPLINE_INTERPOLATION'
	| 'SIMPLE_REGRESSION'
	| 'MULTIPLE_REGRESSION'
	| 'TRAPEZOIDAL_RULE'
	| 'SIMPSON_RULE'
	| 'DIFFERENTIATION';
