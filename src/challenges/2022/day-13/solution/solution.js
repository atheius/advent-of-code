import { max } from "../../../../helpers.js";

const sortPackets = (packet1, packet2) => {
  if (Number.isInteger(packet1) && Number.isInteger(packet1)) {
    if (packet1 < packet2) {
      return -1;
    }
    if (packet1 > packet2) {
      return 1;
    }
    if (packet1 === packet2) {
      return 0;
    }
  }

  if (Array.isArray(packet1) && Number.isInteger(packet2)) {
    packet2 = [packet2];
  }

  if (Array.isArray(packet2) && Number.isInteger(packet1)) {
    packet1 = [packet1];
  }

  let sorted = 0;
  for (let i = 0; i < max([packet1.length, packet2.length]); i++) {
    if (packet1.length - 1 < i) {
      return -1;
    }

    if (packet2.length - 1 < i) {
      return 1;
    }

    sorted = sortPackets(packet1[i], packet2[i]);
    if (sorted === -1) {
      return -1;
    } else if (sorted === 1) {
      return 1;
    }
  }

  return 0;
};

const part1 = (input) => {
  const packets = input
    .trim()
    .split("\n\n")
    .map((x) => x.split("\n").map((x) => JSON.parse(x.trim())));

  let sumCorrectIndexes = 0;
  let index = 1;
  for (const [packet1, packet2] of packets) {
    if (sortPackets(packet1, packet2) === -1) {
      sumCorrectIndexes = sumCorrectIndexes + index;
    }
    index += 1;
  }

  return sumCorrectIndexes;
};

const part2 = (input) => {
  let packets = input
    .trim()
    .split("\n\n")
    .map((x) => x.split("\n").map((x) => JSON.parse(x.trim())))
    .reduce((acc, curr) => [...acc, curr[0], curr[1]], []);

  packets.push([[2]]);
  packets.push([[6]]);

  const sortedPackets = packets
    .sort((a, b) => sortPackets(a, b))
    .map((x) => JSON.stringify(x));

  return (
    (sortedPackets.indexOf("[[2]]") + 1) * (sortedPackets.indexOf("[[6]]") + 1)
  );
};

export { part1, part2 };
