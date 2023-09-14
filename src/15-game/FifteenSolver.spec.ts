import { FifteenGame } from "./FifteenGame";
import { calculateScore } from "./FifteenSolver";

describe('FifteenSolver', () => {
  it('calculates how many moves are left to the target state', () => {
    const game = new FifteenGame([
      {
        target: 0,
        title: '1',
        x: 0,
        y: 0,
      },
      {
        target: 1,
        title: '2',
        x: 1,
        y: 0,
      },
      {
        target: 2,
        title: '3',
        x: 1,
        y: 1,
      },
      {
        target: 3,
        title: '4',
        x: 0,
        y: 1,
      },
    ]);
    expect(calculateScore(game)).toBe(2);
  })
});
