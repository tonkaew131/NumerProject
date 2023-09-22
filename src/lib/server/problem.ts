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
}

export class ProblemSolved {
	protected problemSolvedId?: string;
	protected problemId: string;

	constructor(problemId: string) {
		if (!problemId) throw new Error('Problem ID is required!');

		this.problemId = problemId;
	}
}

type ProblemType = 'INTERPOLATION' | 'DIFFERENTIATION' | 'INTEGRATION';
