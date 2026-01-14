
export const Colors = {
    HEADER: 'header',
    BLUE: 'blue',
    CYAN: 'cyan',
    GREEN: 'green',
    WARNING: 'warn',
    FAIL: 'fail',
    DIM: 'dim',
    BOLD: 'bold'
};

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export function formatCurrency(amount) {
    return '$' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function generateIP() {
    return `${randomInt(10, 255)}.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`;
}
