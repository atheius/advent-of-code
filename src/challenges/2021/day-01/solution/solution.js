import { readLinesOfNumbers } from "../../../../helpers.js";

const part1 = (input) => {
  const nums = readLinesOfNumbers(input);

  let answer = 0;

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] - nums[i - 1] > 0) {
      answer += 1;
    }
  }

  return answer;
};

const part2 = (input) => {
  const nums = readLinesOfNumbers(input);

  let answer = 0;
  let prev = 0;

  for (let i = 0; i < nums.length - 2; i++) {
    const next = nums[i] + nums[i + 1] + nums[i + 2];
    if (i > 0 && next - prev > 0) {
      answer += 1;
    }
    prev = next;
  }

  return answer;
};

export { part1, part2 };
