import { FifteenGame, Tile } from './FifteenGame';

export class AStarStep {
  constructor(
    public game: FifteenGame,
    public score: number = 0,
    public lastMovedTile: Tile | null = null,
    public parent: AStarStep | null = null,
    public hash: string = game.hash()
  ) {}
}

export type Status = {
  numberOfOpenItems: number;
  numberOfClosedItems: number;
  bestScore: number;
  currentGame: Readonly<Tile[]>;
  unableToSolve: boolean;
};

export type StatusReporter = (status: Status) => void;

export function fifteenSolver(
  game: FifteenGame,
  statusReporter?: StatusReporter
): AStarStep | null {
  let positionsToProcess: AStarStep[] = [];
  const processedPositions: string[] = [];

  positionsToProcess.push(new AStarStep(game));

  while (positionsToProcess.length > 0) {

    // find the best position we currently have
    const currentNode: AStarStep = positionsToProcess.reduce((acc, curr) => {
      if (curr.score < acc.score) {
        return curr;
      } else {
        return acc;
      }
    }, positionsToProcess[0]);

    statusReporter?.({
      bestScore: currentNode.score,
      numberOfClosedItems: processedPositions.length,
      numberOfOpenItems: positionsToProcess.length,
      currentGame: currentNode.game.getTiles(),
      unableToSolve: false
    });

    positionsToProcess = positionsToProcess.filter((item) => item !== currentNode);
    processedPositions.push(currentNode.game.hash());

    // check if this is the target game state
    if (currentNode.game.isAllSettled()) {
      return currentNode;
    }

    generateNextMoves(currentNode.game).forEach((tile) => {
      const nextMove = currentNode.game.move(tile);
      const nextMoveHash = nextMove.hash();
      // if we've already been here, skip
      if (processedPositions.includes(nextMoveHash)) {
        return;
      }

      const nextMoveScore = calculateScore(nextMove);

      const nextMoveInOpenList = positionsToProcess.find(
        (openListItem) => openListItem.hash === nextMoveHash
      );
      // if we have this one to process but with better score, skip
      if (nextMoveInOpenList && nextMoveInOpenList.score > nextMoveScore) {
        return;
      }

      positionsToProcess.push(new AStarStep(nextMove, nextMoveScore, tile, currentNode));
    });
  }

  statusReporter?.({
    bestScore: 0,
    numberOfClosedItems: 0,
    numberOfOpenItems: 0,
    currentGame: [],
    unableToSolve: true
  });
  return null;
}

function generateNextMoves(game: FifteenGame): Tile[] {
  return game
    .getTiles()
    .map((tile) => {
      try {
        game.move(tile); // try move if it's possible
        return tile;
      } catch (e) {
        return null;
      }
    })
    // filter out invalid moves
    .filter((tile): tile is Tile => !!tile);
}

/**
 * The lower the better. It calculates how each tile is far away from it's target position. I use power of two because the further away, the worse.
 */
export function calculateScore(game: FifteenGame): number {
  const size = game.getSize();
  return game.getTiles().reduce((acc, tile) => {
    if (!tile.target) {
      return acc;
    }
    const targetX = tile.target % size;
    const targetY = Math.floor(tile.target / size);

    return (
      acc + Math.abs(targetX - tile.x) ** 2 + Math.abs(targetY - tile.y) ** 2
    );
  }, 0);
}
