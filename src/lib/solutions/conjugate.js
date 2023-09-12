import { create, all } from 'mathjs'

const config = {}
const math = create(all, config);

function conjugateGradientMethods(matrixA, matrixB, initialX, errorPercentage) {
    const calculateResidual = (A, B, X) => {
        const matrixA = math.matrix(A);
        const matrixB = math.matrix(B);
        const matrixX = math.matrix(X);
        const out = math.subtract(math.multiply(matrixA, matrixX), matrixB);
        return out;
    }

    const calculateDistance0 = (residualMatrix) => {
        return math.multiply(-1, residualMatrix);
    };

    const calculateDistance = (residualMatrix, distanceMatrix, matrixAa) => {
        const rT = math.transpose(residualMatrix);
        const dT = math.transpose(distanceMatrix);
        const alpha = math.divide(math.multiply(math.multiply(rT, matrixA), distanceMatrix), math.multiply(math.multiply(dT, matrixA), distanceMatrix));

        console.log('alpha:', alpha.toString());

        const out = math.add(math.multiply(-1, residualMatrix), math.multiply(alpha, distanceMatrix));
        return out
    };

    const calculateLambda = (residualMatrix, distanceMatrix, matrixA) => {
        const out = math.divide(math.multiply(math.transpose(distanceMatrix), residualMatrix), math.multiply(math.multiply(math.transpose(distanceMatrix), matrixA), distanceMatrix));
        return math.multiply(-1, out);
    };

    const calculateMatrixXk1 = (matrixXk, lambda, distanceMatrix) => {
        const out = math.add(matrixXk, math.multiply(lambda, distanceMatrix));
        return out;
    };

    const calculateError = (residualMatrix) => {
        return math.sqrt(math.multiply(math.transpose(residualMatrix), residualMatrix));
    };

    const r0 = calculateResidual(matrixA, matrixB, initialX);

    const d0 = calculateDistance0(r0);
    const l0 = calculateLambda(r0, d0, matrixA);
    console.log('l0', l0.toString());
    const x1 = calculateMatrixXk1(initialX, l0, d0);
    console.log('x1', x1.toString());
    const r1 = calculateResidual(matrixA, matrixB, x1);
    console.log('r1', r1.toString());
    console.log('error', calculateError(r1).toString());

    const d1 = calculateDistance(r1, d0, matrixA);
    console.log('\nd1', d1.toString());
    const l1 = calculateLambda(r1, d1, matrixA);
    console.log('l1', l1.toString());
    const x2 = calculateMatrixXk1(x1, l1, d1);
    console.log('x2', x2.toString());
    const r2 = calculateResidual(matrixA, matrixB, x2);
    console.log('r2', r2.toString());
    console.log('error', calculateError(r2).toString());

    const d2 = calculateDistance(r2, d1, matrixA);
    console.log('\nd2', d2.toString());
    const l2 = calculateLambda(r2, d2, matrixA);
    console.log('l2', l2.toString());
    const x3 = calculateMatrixXk1(x2, l2, d2);
    console.log('x3', x3.toString());
    const r3 = calculateResidual(matrixA, matrixB, x3);
    console.log('r3', r3.toString());
    console.log('error', calculateError(r3).toString());

    const d3 = calculateDistance(r3, d2, matrixA);
    console.log('\nd3', d3.toString());
    const l3 = calculateLambda(r3, d3, matrixA);
    console.log('l3', l3.toString());
    const x4 = calculateMatrixXk1(x3, l3, d3);
    console.log('x4', x4.toString());
    const r4 = calculateResidual(matrixA, matrixB, x4);
    console.log('r4', r4.toString());
    console.log('error', calculateError(r4).toString());
}

const matrixA = [
    [5, 2, 0, 0],
    [2, 5, 2, 0],
    [0, 2, 5, 2],
    [0, 0, 2, 5],
];

const matrixB = [
    12, 17, 14, 7
];

const initialX = [0, 0, 0, 0];

conjugateGradientMethods(matrixA, matrixB, initialX, 0.001);