import { readLines } from "../../../../helpers.js";

const isVariable = (x) => x.match(/[a-z]/) !== null;

const getValue = (x, memory) =>
  x ? (isVariable(x) ? memory[x] : parseInt(x, 10)) : null;

const getMemoryValue = (x, memory) => memory[x] || 0;

const runInstruction = (operator, val1, val2) => {
  if (operator === "add") {
    return val1 + val2;
  }
  if (operator === "mul") {
    return val1 * val2;
  }
  if (operator === "div") {
    return Math.floor(val1 / val2);
  }
  if (operator === "mod") {
    return val1 % val2;
  }
  if (operator === "eql") {
    return val1 === val2 ? 1 : 0;
  }
};

/**
 * We din't have to actually create the ALU, but hey...
 * @param {*} program
 * @param {*} input
 * @returns
 */
const alu = (program, input) => {
  input.reverse();
  const memory = {};
  for (const instruction of program) {
    const [operator, val1, val2] = instruction.split(" ");
    if (operator === "inp") {
      memory[val1] = input.pop() || 0;
    } else {
      const actualVal1 = getMemoryValue(val1, memory);
      const actualVal2 = getValue(val2, memory);
      memory[val1] = runInstruction(operator, actualVal1, actualVal2);
    }
  }
  return memory;
};

/**
 * We know 7 of the 14 steps can affect the value of z.
 * This function check a combination of 7 digits based
 * on how they affect the value of z
 * @param {*} digits
 * @returns
 */
const checkDigits = (digits) => {
  let z = 0;

  // Store the final model number
  const modelNumber = [];

  // The specific type of check done at each step
  const stepType = [1, 1, 1, 1, 1, 2, 1, 2, 2, 1, 2, 2, 2, 2];

  // Special values we use to adjust z based on my input
  const stepValue = [4, 11, 5, 11, 14, 10, 11, 9, 3, 5, 5, 10, 4, 5];

  let digitNum = 0;
  for (let i = 0; i < 14; i += 1) {
    if (stepType[i] === 1) {
      // Check type 1
      z = z * 26 + digits[digitNum] + stepValue[i];
      modelNumber[i] = digits[digitNum];
      digitNum += 1;
    } else {
      // Check type 2
      modelNumber[i] = (z % 26) - stepValue[i];
      z = Math.floor(z / 26);
      if (modelNumber[i] <= 0 || modelNumber[i] > 9) {
        return null;
      }
    }
  }
  return modelNumber.join("");
};

const part1 = (input, inputDigits) => {
  const program = readLines(input);
  if (!inputDigits) {
    // Brute force 7 digits (reversed)
    for (let i = 9999999; i >= 1111111; i -= 1) {
      const digits = i
        .toString()
        .split("")
        .map((x) => parseInt(x, 10));
      // Skip digits with a 0 in
      if (digits.indexOf(0) === -1) {
        const modelNumber = checkDigits(digits);
        if (modelNumber != null) {
          // Just for fun, lets throw it through the ALU to check it works
          const { z } = alu(
            program,
            modelNumber.split("").map((x) => parseInt(x, 10))
          );
          if (z === 0) {
            return modelNumber;
          }
        }
      }
    }
  } else {
    // Just run the program and get the output
    return alu(program, inputDigits);
  }
};

const part2 = (input, inputDigits) => {
  const program = readLines(input);
  if (!inputDigits) {
    // Brute force 7 digits (forwards)
    for (let i = 1111111; i <= 9999999; i += 1) {
      const digits = i
        .toString()
        .split("")
        .map((x) => parseInt(x, 10));
      // Skip digits with a 0 in
      if (digits.indexOf(0) === -1) {
        const modelNumber = checkDigits(digits);
        if (modelNumber != null) {
          // Just for fun, lets throw it through the ALU to check it works
          const { z } = alu(
            program,
            modelNumber.split("").map((x) => parseInt(x, 10))
          );
          if (z === 0) {
            return modelNumber;
          }
        }
      }
    }
  } else {
    // Just run the program and get the output
    return alu(program, inputDigits);
  }
};

export { part1, part2 };
