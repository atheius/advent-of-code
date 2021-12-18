import { sum, product, min, max } from "../../../../helpers.js";

const hexToBin = (hex) => parseInt(hex, 16).toString(2).padStart(4, "0");
const binToDec = (bin) => parseInt(bin, 2);

const operatorIdMap = {
  0: sum,
  1: product,
  2: min,
  3: max,
  5: (x) => (x[0] > x[1] ? 1 : 0),
  6: (x) => (x[0] < x[1] ? 1 : 0),
  7: (x) => (x[0] === x[1] ? 1 : 0),
};

const processBitStream = (binaryString) => {
  let packets = [];
  let currentPacket = null;
  let parentPacket = null;

  for (let i = 0; i < binaryString.length; i += 1) {
    if (binaryString.length - i < 8) {
      break;
    }

    currentPacket = {};
    currentPacket.version = binToDec(binaryString.slice(i, i + 3));
    currentPacket.id = binToDec(binaryString.slice(i + 3, i + 6));

    if (currentPacket.id !== 4) {
      // This is an operator packet
      currentPacket.lengthTypeId = binaryString.slice(i + 6, i + 7);
      currentPacket.subPackets = [];
      if (currentPacket.lengthTypeId === "0") {
        // The next 15 bits represent the subpackets total length
        currentPacket.subPacketsTotalLength = binToDec(
          binaryString.slice(i + 7, i + 22)
        );
        currentPacket.binary = binaryString.slice(i, i + 22);
        i += 21;
      } else {
        // The next 11 bits are the number of sub packets
        currentPacket.numSubPackets = binToDec(
          binaryString.slice(i + 7, i + 18)
        );
        currentPacket.binary = binaryString.slice(i, i + 18);
        i += 17;
      }
    } else {
      // This is a literal packet
      let fullLiteralString = [];
      let lastGroup = false;
      let groupIdx = i + 6;
      while (!lastGroup) {
        const nextGroup = binaryString.slice(groupIdx, groupIdx + 5);
        if (nextGroup[0] !== "1") {
          lastGroup = true;
        }
        fullLiteralString.push(nextGroup.slice(1, 5));
        groupIdx += 5;
      }
      currentPacket.literalValue = binToDec(fullLiteralString.join(""));
      currentPacket.binary = fullLiteralString.join("");
      // discard the zero padding
      const subPacketLength =
        sum(parentPacket.subPackets.map((x) => x.binary.length + 6)) +
        fullLiteralString.join("").length +
        6;
      let padding = 0;
      i += (fullLiteralString.length + 1) * 5 + padding;
    }

    if (!parentPacket) {
      // this is a parent packet
      parentPacket = { ...currentPacket };
      packets.push(parentPacket);
    } else {
      // this is a child packet
      parentPacket.subPackets.push({ ...currentPacket });
    }
  }

  return packets;
};

const processPackets = (packets, id = null) => {
  const values = [];
  for (let packet of packets) {
    if (packet.subPackets) {
      values.push(...processPackets(packet.subPackets, packet.id));
    } else {
      values.push(packet.literalValue);
    }
  }

  if (id === null) {
    return values[0];
  }

  return [operatorIdMap[id](values)];
};

const part1 = (input) => {
  let binaryString = "";

  for (let char of input.trim()) {
    binaryString += hexToBin(char);
  }

  const packets = processBitStream(binaryString);
  const packetVersions = packets.map((packet) => packet.version);

  return sum(packetVersions);
};

const part2 = (input) => {
  let binaryString = "";

  for (let char of input.trim()) {
    binaryString += hexToBin(char);
  }

  console.log(binaryString);

  const packets = processBitStream(binaryString);

  console.log(JSON.stringify(packets));

  const result = processPackets(packets);

  return result;
};

export { part1, part2 };
