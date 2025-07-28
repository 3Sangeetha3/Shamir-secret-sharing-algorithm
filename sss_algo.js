const fs =  require("fs");
const { parse } = require("path");

function decodeValue(value, base){
    return BigInt(parseInt(value, base)); 
}
function bigIntDiv(a, b) {
    if (b === 0n) {
        throw new Error("Division by zero: Attempted to divide " + a + " by " + b);
    }
    return a / b;
}
function Lagrange(points) {
    let c = 0n;

    for(let i=0;i<points.length;i++){
        let xi = points[i].x;
        let yi = points[i].y;
        let li0_num = 1n;
        let li0_den = 1n;

        for(let j=0;j<points.length;j++){
            if(i !== j){
                let xj = points[j].x;
                li0_num *= -xj;
                li0_den *= (xi - xj);
            }
        }

        const li = bigIntDiv(li0_num, li0_den);
        c += yi * li;
    }
    return c;
}
function processTestCase(testCaseJson) {
    const data = JSON.parse(testCaseJson);
    const k = data.keys.k;

    const points = [];
    for (const key in data) {
        if(key !== "keys"){
            const x = BigInt(key);
            const base = data[key].base;
            const value = data[key].value;
            const y = decodeValue(value, parseInt(base));
            points.push({x:x, y:y});
        }
    }

    const pointsToUse = points.slice(0, k);
    const constant = Lagrange(pointsToUse);

    return constant.toString();
}

const input1 = 'input1.json';
const input2 = 'input2.json';

console.log("Processing Input1: ");
try {
    const data1 = fs.readFileSync(input1, 'utf8');
    const secret1 = processTestCase(data1);
    console.log("Secret from Input1:", secret1);
}catch (error){
    console.error(`Error reading Input1: ${input1}`, error.message);
}

console.log("Processing Input2: ");
try {
    const data2 = fs.readFileSync(input2, 'utf8');
    const secret2 = processTestCase(data2);
    console.log("Secret from Input1:", secret2);
}catch (error){
    console.error(`Error reading Input1: ${input2}`, error.message);
}