import { create, all } from 'mathjs'

const config = {}
const math = create(all, config);

function copyArray(array) {
    const out = [];
    for (let i = 0; i < array.length; i++) {
        out.push(array[i]);
    }
    return out;
}

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

    const calculateAlpha = (residualMatrix, distanceMatrix, matrixA) => {
        const rT = math.transpose(residualMatrix);
        const dT = math.transpose(distanceMatrix);
        const alpha = math.divide(math.multiply(math.multiply(rT, matrixA), distanceMatrix), math.multiply(math.multiply(dT, matrixA), distanceMatrix));

        return alpha;
    };

    const calculateDistance = (residualMatrix, distanceMatrix, matrixAa, alpha) => {
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

    // this is the first iteration
    // d0
    let dk_1 = d0;
    // r0
    let rk_1 = r0;
    // x0
    let xk_1 = initialX;

    let iter = 0;

    let lk_1, xk, rk, ek, ak_1;
    while (true) {
        iter++;

        if (iter >= 2) {
            ak_1 = calculateAlpha(rk_1, dk_1, matrixA);
            dk_1 = calculateDistance(rk_1, dk_1, matrixA, ak_1);
        }
        lk_1 = calculateLambda(rk_1, dk_1, matrixA);
        xk = calculateMatrixXk1(xk_1, lk_1, dk_1);
        rk = calculateResidual(matrixA, matrixB, xk);
        ek = calculateError(rk);

        console.log('\niter:', iter);
        if (iter >= 2) console.log('alpha:', ak_1.toString());
        console.log('dk_1:', dk_1.toString());
        console.log('lk_1:', lk_1.toString());
        console.log('xk:', xk.toString());
        console.log('rk:', rk.toString());
        console.log('ek:', ek.toString());

        if (calculateError(rk) * 100 < errorPercentage || isNaN(ek)) {
            break;
        }

        rk_1 = rk;
        xk_1 = xk;
    }
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