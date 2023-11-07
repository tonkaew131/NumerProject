import { all, create } from 'mathjs';

const config = {};
const math = create(all, config);

export interface ConjugateGradientResult {
	iterations: {
		iter: number;
		alpha?: number | math.MathType;
		dk_1: number[] | math.Matrix | math.MathArray;
		lk_1: number | math.MathType;
		xk: number[] | math.Matrix | math.MathArray;
		rk: number[] | math.Matrix | math.MathArray;
		ek: number;
	}[];
	answers?: number[] | math.Matrix | math.MathArray;
	error?: 'Not Symmetric Matrix' | 'Max Iterations Reached' | 'Not Positive Definite Matrix';
}

export function conjugateGradientMethods(
	matrixA: number[][],
	matrixB: number[],
	initialX: number[],
	errorPercentage: number,
	logging = false
): ConjugateGradientResult {
	const calculateResidual = (
		A: number[][] | math.Matrix,
		B: number[] | math.Matrix,
		X: number[] | math.Matrix
	): math.Matrix => {
		const matrixA = math.matrix(A);
		const matrixB = math.matrix(B);
		const matrixX = math.matrix(X);
		const out = math.subtract(math.multiply(matrixA, matrixX), matrixB);
		return out;
	};

	const calculateDistance0 = (residualMatrix: math.Matrix) => {
		return math.multiply(-1, residualMatrix);
	};

	const calculateAlpha = (
		residualMatrix: math.Matrix,
		distanceMatrix: math.Matrix,
		matrixA: number[][] | math.Matrix
	): math.MathType => {
		const rT = math.transpose(residualMatrix);
		const dT = math.transpose(distanceMatrix);
		const alpha = math.divide(
			math.multiply(math.multiply(rT, matrixA), distanceMatrix),
			math.multiply(math.multiply(dT, matrixA), distanceMatrix)
		);

		return alpha;
	};

	const calculateDistance = (
		residualMatrix: math.Matrix,
		distanceMatrix: math.Matrix,
		alpha: number | math.MathType
	) => {
		const out = math.add(math.multiply(-1, residualMatrix), math.multiply(alpha, distanceMatrix));
		return out;
	};

	const calculateLambda = (
		residualMatrix: math.Matrix,
		distanceMatrix: math.Matrix,
		matrixA: number[][] | math.Matrix
	) => {
		const out = math.divide(
			math.multiply(math.transpose(distanceMatrix), residualMatrix),
			math.multiply(math.multiply(math.transpose(distanceMatrix), matrixA), distanceMatrix)
		);
		return math.multiply(-1, out);
	};

	const calculateMatrixXk1 = (
		matrixXk: number[] | math.Matrix,
		lambda: number | math.MathType,
		distanceMatrix: math.Matrix
	): math.Matrix => {
		const out = math.add(matrixXk, math.multiply(lambda, distanceMatrix));
		return math.matrix(out);
	};

	const calculateError = (residualMatrix: math.Matrix): number => {
		const errorPower = Number(math.multiply(math.transpose(residualMatrix), residualMatrix));
		return Number(math.sqrt(errorPower));
	};

	const r0 = calculateResidual(matrixA, matrixB, initialX);
	const d0 = calculateDistance0(r0);

	const result: ConjugateGradientResult = {
		iterations: []
	};

	if (math.matrix(matrixA).toString() != math.transpose(math.matrix(matrixA)).toString()) {
		result.error = 'Not Symmetric Matrix';
		return result;
	}

	for (let i = 0; i < matrixA.length; i++) {
		const subsetMatrix = math.subset(
			math.matrix(matrixA),
			math.index(math.range(0, i + 1), math.range(0, i + 1))
		);

		if (math.det(subsetMatrix) <= 0) {
			result.error = 'Not Positive Definite Matrix';
			return result;
		}
	}

	// this is the first iteration
	// d0
	let dk_1 = d0;
	// r0
	let rk_1 = r0;
	// x0
	let xk_1: number[] | math.Matrix = initialX;

	let iter = 0;
	const MAX_ITER = 1000;

	let lk_1,
		xk: math.Matrix = math.matrix([]),
		rk,
		ek,
		ak_1;
	let found = false;
	while (iter < MAX_ITER) {
		iter++;

		if (iter >= 2) {
			ak_1 = calculateAlpha(rk_1, dk_1, matrixA);
			dk_1 = calculateDistance(rk_1, dk_1, ak_1);
		}
		lk_1 = calculateLambda(rk_1, dk_1, matrixA);
		xk = calculateMatrixXk1(xk_1, lk_1, dk_1);
		rk = calculateResidual(matrixA, matrixB, xk);
		ek = calculateError(rk);

		if (logging) {
			console.log('\niter:', iter);
			if (iter >= 2 && ak_1 != undefined) console.log('alpha:', ak_1.toString());
			console.log('dk_1:', dk_1.toString());
			console.log('lk_1:', lk_1.toString());
			console.log('xk:', xk.toString());
			console.log('rk:', rk.toString());
			console.log('ek:', ek.toString());
		}

		result.iterations.push({
			iter: iter,
			dk_1: dk_1.toArray(),
			lk_1: lk_1,
			xk: xk.toArray(),
			rk: rk.toArray(),
			ek: ek
		});

		if (calculateError(rk) * 100 < errorPercentage || isNaN(ek)) {
			found = true;
			break;
		}

		rk_1 = rk;
		xk_1 = xk;
	}

	if (found) {
		result.answers = xk.toArray();
	} else {
		result.error = 'Max Iterations Reached';
	}

	return result;
}

export function conjugateGraph(
	matrixA: number[][],
	matrixB: number[],
	x: number,
	y: number
): {
	error?: string;
	z: number;
} {
	const result = { z: 0, error: '' };

	if (matrixA.length != 2) {
		result.error = 'Matrix A must be 2x2';
		return result;
	}

	const a = matrixA[0][0];
	const b = matrixA[0][1];
	const c = matrixA[1][0];
	const d = matrixA[1][1];

	const e = matrixB[0];
	const f = matrixB[1];

	result.z = 0.5 * (x * (a * x + y * c) + y * (x * b + y * d)) - e * x - f * y;

	return result;
}

// const matrixA = [
// 	[5, 2, 0, 0],
// 	[2, 5, 2, 0],
// 	[0, 2, 5, 2],
// 	[0, 0, 2, 5]
// ];

// const matrixB = [12, 17, 14, 7];

// const initialX = [0, 0, 0, 0];

// conjugateGradientMethods(matrixA, matrixB, initialX, 0.001);
