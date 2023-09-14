import { useEffect, useRef, useState } from "react";
import { FifteenGame, Tile } from "./FifteenGame"
import * as Comlink from 'comlink';
import { Status } from "./FifteenSolver";
import { FifteenVisualizer } from "./FifteenVisualizer.tsx";

type Props = {
  game: FifteenGame;
  onSolutionFound: (solution: Tile[] | null) => void;
}

export function Solver({ game, onSolutionFound }: Props) {
  const [status, setStatus] = useState<Status | null>(null);
  const workerInstance = useRef<Comlink.Remote<typeof import("./solver-worker.ts")> | null>(null);

  useEffect(() => {
    const worker = new ComlinkWorker<typeof import("./solver-worker.ts")>(
      new URL("./solver-worker.ts", import.meta.url)
    );

    setStatus(null);
    workerInstance.current = worker;

    // TODO cleanup
  },[game]);

  async function handleSolve() {
    // worker must be ready
    if (!workerInstance.current) { return }
    const tiles = game.getTiles();
    const result = await workerInstance.current.solve(tiles, Comlink.proxy(setStatus));
    onSolutionFound(result);
  }

  const currentGame = status?.currentGame && new FifteenGame(status.currentGame);

  return <div>
    <button onClick={handleSolve}>Solve</button>

    <div>
        <p>Best score: {status?.bestScore}</p>
        <p>Open list lenght: {status?.numberOfOpenItems}</p>
        <p>Closed list lenght: {status?.numberOfClosedItems}</p>
    </div>

    {currentGame && <FifteenVisualizer game={currentGame} />}
  </div>
}