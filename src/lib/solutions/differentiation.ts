import { derivative, evaluate } from 'mathjs';

export interface DifferentiationResult {
	result: number;
	fx: { [key: number]: number };
	h: number;
	exactFunc: string;
	exactResult: number;
	errorValue: number;
	error?: string;
}

export const diffFormula: {
	[direction: string]: {
		[order: number]: {
			[error: string]: {
				[key: number]: number;
				frac: string;
			};
		};
	};
} = {
	forward: {
		1: {
			h: {
				'1': 1,
				'0': -1,
				frac: 'h'
			},
			'h^2': {
				'2': -1,
				'1': 4,
				'0': -3,
				frac: '2h'
			}
		},
		2: {
			h: {
				'2': 1,
				'1': -2,
				'0': 1,
				frac: 'h^2'
			},
			'h^2': {
				'3': -1,
				'2': 4,
				'1': -5,
				'0': 2,
				frac: 'h^2'
			}
		},
		3: {
			h: {
				'3': 1,
				'2': -3,
				'1': 3,
				'0': -1,
				frac: 'h^3'
			},
			'h^2': {
				'4': -3,
				'3': 14,
				'2': -24,
				'1': 18,
				'0': -5,
				frac: '2h^3'
			}
		},
		4: {
			h: {
				'4': 1,
				'3': -4,
				'2': 6,
				'1': -4,
				'0': 1,
				frac: 'h^4'
			},
			'h^2': {
				'5': -2,
				'4': 11,
				'3': -24,
				'2': 26,
				'1': -14,
				'0': 3,
				frac: 'h^4'
			}
		}
	},
	backward: {
		1: {
			h: {
				'0': 1,
				'-1': -1,
				frac: 'h'
			},
			'h^2': {
				'0': 3,
				'-1': -4,
				'-2': 1,
				frac: '2h'
			}
		},
		2: {
			h: {
				'0': 1,
				'-1': -2,
				'-2': 1,
				frac: 'h^2'
			},
			'h^2': {
				'0': 2,
				'-1': -5,
				'-2': 4,
				'-3': -1,
				frac: 'h^2'
			}
		},
		3: {
			h: {
				'0': 1,
				'-1': -3,
				'-2': 3,
				'-3': -1,
				frac: 'h^3'
			},
			'h^2': {
				'0': 5,
				'-1': -18,
				'-2': 24,
				'-3': -14,
				'-4': 3,
				frac: '2h^3'
			}
		},
		4: {
			h: {
				'0': 1,
				'-1': -4,
				'-2': 6,
				'-3': -4,
				'-4': 1,
				frac: 'h^4'
			},
			'h^2': {
				'0': 3,
				'-1': -14,
				'-2': 26,
				'-3': -24,
				'-4': 11,
				'-5': -2,
				frac: 'h^4'
			}
		}
	},
	centered: {
		1: {
			'h^2': {
				'1': 1,
				'-1': -1,
				frac: '2h'
			},
			'h^4': {
				'2': -1,
				'1': 8,
				'-1': -8,
				'-2': 1,
				frac: '12h'
			}
		},
		2: {
			'h^2': {
				'1': 1,
				'0': -2,
				'-1': 1,
				frac: 'h^2'
			},
			'h^4': {
				'2': -1,
				'1': 16,
				'0': -30,
				'-1': 16,
				'-2': -1,
				frac: '12h^2'
			}
		},
		3: {
			'h^2': {
				'2': 1,
				'1': -2,
				'-1': 2,
				'-2': -1,
				frac: '2h^3'
			},
			'h^4': {
				'3': -1,
				'2': 8,
				'1': -13,
				'-1': 13,
				'-2': -8,
				'-3': 1,
				frac: '8h^3'
			}
		},
		4: {
			'h^2': {
				'2': 1,
				'1': -4,
				'0': 6,
				'-1': -4,
				'-2': 1,
				frac: 'h^4'
			},
			'h^4': {
				'3': -1,
				'2': 12,
				'1': -39,
				'0': 56,
				'-1': -39,
				'-2': 12,
				'-3': -1,
				frac: '6h^4'
			}
		}
	}
};

export function differentiation(
	func: string,
	x: number,
	h: number,
	order: 1 | 2 | 3 | 4 | number,
	error: 'h' | 'h^2' | 'h^4' | string,
	direction: 'forward' | 'backward' | 'centered' | string
): DifferentiationResult {
	const result: DifferentiationResult = {
		result: 0,
		fx: {},
		h: 0,
		exactFunc: '',
		exactResult: 0,
		errorValue: 0
	};

	if (order < 1 || order > 4) {
		result.error = 'Invalid order';
		return result;
	}

	if (error != 'h' && error != 'h^2' && error != 'h^4') {
		result.error = 'Invalid error';
		return result;
	}

	if (direction != 'forward' && direction != 'backward' && direction != 'centered') {
		result.error = 'Invalid direction';
		return result;
	}

	const fx: { [key: number]: number } = {};
	const calculateFx = (i: number): number => {
		if (i in fx) return fx[i];

		const xValue = x + i * h;
		fx[i] = evaluate(func, { x: xValue });
		return fx[i];
	};

	const formula = diffFormula[direction][order][error];

	if (!formula) {
		result.error = 'Invalid parameters';
		return result;
	}

	result.exactFunc = func;
	for (let i = 0; i < order; i++) {
		result.exactFunc = derivative(result.exactFunc, 'x').toString();
	}
	result.exactResult = evaluate(result.exactFunc, { x });

	const hValue = evaluate(formula.frac, { h });
	result.h = hValue;
	for (const i in formula) {
		if (i == 'frac') continue;

		const value = formula[i] * calculateFx(parseInt(i));
		result.fx[i] = value;
		result.result += value;
	}

	result.result /= hValue;
	result.errorValue = Math.abs((result.result - result.exactResult) / result.exactResult);

	return result;
}

// console.log({
// 	'1.1': differentiation('e^x', 2, 0.25, 1, 'h', 'forward'),
// 	'1.2': differentiation('e^x', 2, 0.25, 1, 'h', 'backward'),
// 	'1.3': differentiation('e^x', 2, 0.25, 1, 'h^2', 'centered'),
// 	'2.1': differentiation('e^(x/3)+x^2', -2.5, 0.1, 2, 'h^2', 'forward'),
// 	'2.2': differentiation('e^(x/3)+x^2', -2.5, 0.1, 2, 'h^2', 'backward'),
// 	'2.3': differentiation('e^(x/3)+x^2', -2.5, 0.1, 2, 'h^4', 'centered')
// });
