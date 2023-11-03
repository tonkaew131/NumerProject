type ProblemType =
	| 'ROOT_OF_EQUATION'
	| 'LINEAR_ALGEBRA_EQUATION'
	| 'INTERPOLATION'
	| 'EXTRAPOLATION'
	| 'INTEGRATION'
	| 'DIFFERENTIATION';

const ProblemData: {
	[key: string]: {
		name: string;
		url: string;
	};
} = {
	ROOT_OF_EQUATION: {
		name: 'Root of equation',
		url: '/root'
	},
	LINEAR_ALGEBRA_EQUATION: {
		name: 'Linear algebra equation',
		url: '/linear'
	},
	INTERPOLATION: {
		name: 'Interpolation',
		url: '/interpolation'
	},
	EXTRAPOLATION: {
		name: 'Extrapolation',
		url: '/extrapolation'
	},
	INTEGRATION: {
		name: 'Integration',
		url: '/integration'
	},
	DIFFERENTIATION: {
		name: 'Differentiation',
		url: '/differentiation'
	}
};

type SolutionType =
	| 'GRAPHICAL_METHOD'
	| 'BISECTION_METHOD'
	| 'FALSE_POSITION_METHOD'
	| 'ONE_POINT_ITERATION_METHOD'
	| 'NEWTON_RAPHSON_METHOD'
	| 'SECANT_METHOD'
	| 'CRAMER_RULE'
	| 'GAUSSIAN_ELIMINATION'
	| 'GAUSS_JORDAN_ELIMINATION'
	| 'MATRIX_INVERSION'
	| 'LU_DECOMPOSITION'
	| 'CHOLESKY_DECOMPOSITION'
	| 'JACOBI_ITERATION_METHOD'
	| 'GAUSS_SEIDEL_ITERATION_METHOD'
	| 'CONJUGATE_GRADIENT_METHOD';

const SolutionData: {
	[key: string]: {
		problemType: ProblemType;
		name: string;
		url: string;
	};
} = {
	GRAPHICAL_METHOD: {
		problemType: 'ROOT_OF_EQUATION',
		name: 'Graphical method',
		url: '/root/graphical'
	},
	BISECTION_METHOD: {
		problemType: 'ROOT_OF_EQUATION',
		name: 'Bisection method',
		url: '/root/bisection'
	},
	FALSE_POSITION_METHOD: {
		problemType: 'ROOT_OF_EQUATION',
		name: 'False position method',
		url: '/root/false'
	},
	ONE_POINT_ITERATION_METHOD: {
		problemType: 'ROOT_OF_EQUATION',
		name: 'One-point iteration method',
		url: '/root/one-point'
	},
	NEWTON_RAPHSON_METHOD: {
		problemType: 'ROOT_OF_EQUATION',
		name: 'Newton-Raphson method',
		url: '/root/newton'
	},
	SECANT_METHOD: {
		problemType: 'ROOT_OF_EQUATION',
		name: 'Secant method',
		url: '/root/secant'
	},
	CRAMER_RULE: {
		problemType: 'LINEAR_ALGEBRA_EQUATION',
		name: "Cramer's rule",
		url: '/linear/cramer'
	},
	GAUSSIAN_ELIMINATION: {
		problemType: 'LINEAR_ALGEBRA_EQUATION',
		name: 'Gaussian elimination',
		url: '/linear/gauss'
	},
	GAUSS_JORDAN_ELIMINATION: {
		problemType: 'LINEAR_ALGEBRA_EQUATION',
		name: 'Gauss-Jordan elimination',
		url: '/linear/jordan'
	},
	MATRIX_INVERSION: {
		problemType: 'LINEAR_ALGEBRA_EQUATION',
		name: 'Matrix inversion',
		url: '/linear/inversion'
	},
	LU_DECOMPOSITION: {
		problemType: 'LINEAR_ALGEBRA_EQUATION',
		name: 'LU decomposition method',
		url: '/linear/lu'
	},
	CHOLESKY_DECOMPOSITION: {
		problemType: 'LINEAR_ALGEBRA_EQUATION',
		name: 'Cholesky decomposition method',
		url: '/linear/cholesky'
	},
	JACOBI_ITERATION_METHOD: {
		problemType: 'LINEAR_ALGEBRA_EQUATION',
		name: 'Jacobi iteration method',
		url: '/linear/jacobi'
	},
	GAUSS_SEIDEL_ITERATION_METHOD: {
		problemType: 'LINEAR_ALGEBRA_EQUATION',
		name: 'Gauss-Seidel iteration method',
		url: '/linear/seidel'
	},
	CONJUGATE_GRADIENT_METHOD: {
		problemType: 'LINEAR_ALGEBRA_EQUATION',
		name: 'Conjugate gradient method',
		url: '/linear/conjugate'
	}
};

export { ProblemData, SolutionData };
export type { SolutionType };
