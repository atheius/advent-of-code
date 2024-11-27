# 🎄 Advent of Code 🎄

Project for AOC challenges and solutions.

## Setup

Create a .env file with the following:

```
SESSION_TOKEN=<aoc-session-token>
```

Link the package locally:

```sh
npm link
```

## CLI

Initialise a day:

```sh
aoc --init --day 1
```

Run a solution:

```sh
aoc --solve --day 1 --part 1
```

Submit a solution:

```
aoc --submit --day 1 --part 1
```

## Test

Run tests with:

```sh
npm test
```

## Benchmark

Run benchmarks with:

```sh
npm run benchmark
```
