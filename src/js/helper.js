export const alpha = 'ABCDEFGHJKLMNOPQRSTUVWXYZ';
export const vertexEvents = [
    'Click', 'MouseDown', 'MouseUp',
    'MouseMove', 'MouseEnter', 'MouseLeave'
];

export function range(n) { return [...Array(n)].map((_, i) => i); }
export function random(n) { return Math.floor(Math.random() * (n + 1)); }
export function neighborhood([x, y]) { return [[x, y], [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]; }
export function vertexEquals([x1, y1], [x2, y2]) { return x1 === x2 && y1 === y2; }
export function lineEquals([v1, w1], [v2, w2]) { return vertexEquals(v1, v2) && vertexEquals(w1, w2); }


/**
 * 星位，天元，坐标点
 * @param {} width 
 * @param {*} height 
 * @returns 
 */
export function getHoshis(width, height) {
    if (Math.min(width, height) < 6) return [];

    let [nearX, nearY] = [width, height].map(x => x >= 13 ? 3 : 2);
    let [farX, farY] = [width - nearX - 1, height - nearY - 1];
    let [middleX, middleY] = [width, height].map(x => (x - 1) / 2);

    let result = [[nearX, farY], [farX, nearY], [farX, farY], [nearX, nearY]];

    if (width % 2 !== 0 && height % 2 !== 0)
        result.push([middleX, middleY]);
    if (width % 2 !== 0)
        result.push([middleX, nearY], [middleX, farY]);
    if (height % 2 !== 0)
        result.push([nearX, middleY], [farX, middleY]);
    console.log('hoshis: -----------');
    console.log(result);
    return result;
}

export function diffSignMap(before, after) {
    if (before === after || before.length === 0 || before.length !== after.length) {
        return [];
    }

    const result = [...new Array(19)].map(() => new Array(19));
    for (let i = 0; i < before.length; ++i) {
        for (let j = 0; j < before[0].length; j++) {
            if (before[i][j] === 0 && after[i][j] != null && after[i][j] !== 0) {
                result.push([i, j]);
            }
        }
    }
    return result;
}


let helper = { alpha, vertexEvents, range, random, neighborhood, vertexEquals, lineEquals, getHoshis, diffSignMap };
export default helper;