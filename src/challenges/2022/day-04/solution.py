def parse04(filename):
    with open(filename) as f:
        return [[[int(i) for i in e.split("-")] for e in l.strip().split(",")] for l in f.readlines()]


def part1(data):
    for s in data:
        if (s[0][0] <= s[1][0] and s[0][1] >= s[1][1]) or (s[0][0] >= s[1][0] and s[0][1] <= s[1][1]):
            print(s)


data = parse04("input.txt")
part1(data)
