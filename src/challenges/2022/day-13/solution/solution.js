import { max } from "../../../../helpers.js";

const parseInput = (input) =>
  input
    .trim()
    .split("\n\n")
    .map((x) => x.split("\n").map((x) => JSON.parse(x.trim())));

const packetComparator = (packet1, packet2) => {
  if (Number.isInteger(packet1) && Number.isInteger(packet1)) {
    if (packet1 < packet2) {
      return -1;
    }
    if (packet1 === packet2) {
      return 0;
    }
    if (packet1 > packet2) {
      return 1;
    }
  }

  packet1 = Array.isArray(packet1) ? packet1 : [packet1];
  packet2 = Array.isArray(packet2) ? packet2 : [packet2];

  let sorted;
  for (let i = 0; i < max([packet1.length, packet2.length]); i++) {
    if (packet1.length - 1 < i) {
      return -1;
    }
    if (packet2.length - 1 < i) {
      return 1;
    }
    sorted = packetComparator(packet1[i], packet2[i]);
    if (sorted === -1) {
      return -1;
    } else if (sorted === 1) {
      return 1;
    }
  }

  return 0;
};

const part1 = (input) => {
  const packets = parseInput(input);

  let sumCorrectIndexes = 0;
  for (const [index, [packet1, packet2]] of packets.entries()) {
    if (packetComparator(packet1, packet2) === -1) {
      sumCorrectIndexes += index + 1;
    }
  }

  return sumCorrectIndexes;
};

const part2 = (input) => {
  const packets = [
    ...parseInput(input).reduce((acc, curr) => [...acc, ...curr], []),
    [[2]], // These are the "divider" packets
    [[6]],
  ];

  const sortedPackets = packets
    .sort((a, b) => packetComparator(a, b))
    .map((packet) => JSON.stringify(packet));

  return (
    (sortedPackets.indexOf("[[2]]") + 1) * (sortedPackets.indexOf("[[6]]") + 1)
  );
};

export { part1, part2 };
