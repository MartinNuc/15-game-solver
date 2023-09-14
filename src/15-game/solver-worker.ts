/// <reference lib="webworker" />

import { FifteenGame, Tile } from "./FifteenGame";
import { fifteenSolver, AStarStep, Status } from "./FifteenSolver";

export function solve(tiles: Readonly<Tile[]>, reportStatus: (status: Status) => void) {
  const game = new FifteenGame(tiles)
  const solution = fifteenSolver(game, reportStatus);
    if (!solution) {
      return null;
    }

    const solutionTiles: Tile[] = [];
    // collect the solution path from A star tree structure
    let aStarStep: AStarStep | null = solution;
    while(aStarStep) {
      // the very first move has no last moved tile
      if (aStarStep.lastMovedTile) {
        solutionTiles.push(aStarStep.lastMovedTile);
      }
      aStarStep = aStarStep.parent;
    }

    const finalSolution = solutionTiles.reverse()
    return finalSolution;
}

export {};