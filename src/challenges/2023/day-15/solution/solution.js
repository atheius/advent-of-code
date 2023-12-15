import { sum } from "../../../../helpers.js";

const hash = (currentValue, char) =>
  ((currentValue + char.charCodeAt(0)) * 17) % 256;

const calculateHash = (input) =>
  input.split("").reduce((currentValue, char) => hash(currentValue, char), 0);

const getFocusingPower = (boxes) => {
  let power = 0;
  for (const [boxNumber, box] of boxes.entries()) {
    for (const [slotNumber, slot] of box.entries()) {
      power += (1 + boxNumber) * (1 + slotNumber) * Number.parseInt(slot[1]);
    }
  }
  return power;
};

const part1 = (input) => sum(input.trim().split(",").map(calculateHash));

const part2 = (input) => {
  const sequences = input.trim().split(",");

  const boxes = sequences.reduce((boxes, sequence) => {
    const [label, lens] = sequence.split(/[=-]+/);
    const hashValue = calculateHash(label);

    if (sequence.includes("=")) {
      const itemIdx = boxes[hashValue].findIndex(
        ([itemLabel]) => itemLabel === label
      );

      if (itemIdx !== -1) {
        boxes[hashValue][itemIdx][1] = lens;
        return boxes;
      }

      boxes[hashValue] = [...boxes[hashValue], sequence.split("=")];
      return boxes;
    }

    boxes[hashValue] = boxes[hashValue].filter(
      ([itemLabel]) => itemLabel !== label
    );
    return boxes;
  }, Array(256).fill([]));

  return getFocusingPower(boxes);
};

export { part1, part2 };
