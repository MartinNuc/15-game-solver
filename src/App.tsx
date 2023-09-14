import { useEffect, useState } from 'react'
import './App.css'
import { FifteenVisualizer } from './15-game/FifteenVisualizer'
import { Tile, FifteenGame } from './15-game/FifteenGame'
import { Solver } from './15-game/Solver.tsx'

function App() {
  const [tilesFromInput, setTilesFromInput] = useState('{}');
  const [game, setGame] = useState<FifteenGame | null>(null);
  const [solutionStep, setSolutionStep] = useState(0);
  const [solution, setSolution] = useState<Tile[] | null>(null);
  const [isAutosolverEnabled, setIsAutosolverEnabled] = useState(false);

  useEffect(() => {
    try {
      const tiles = JSON.parse(tilesFromInput);
      if (Object.keys(tiles).length > 0) {
        setSolutionStep(0);
        setSolution(null);
        setIsAutosolverEnabled(false);
        setGame(new FifteenGame(tiles));
      }
    } catch (e) {
      console.error(e)
    }
  }, [tilesFromInput]);

  useEffect(() => {
    if (!solution) { return; }
    const nextStep = solution[solutionStep];
    if (!isAutosolverEnabled || !nextStep) { return; }

    const timeoutRef = setTimeout(() => {
      const nextStep = solution[solutionStep];
      setSolutionStep(solutionStep + 1);
      handleMove(nextStep);
    }, 200);

    return () => clearTimeout(timeoutRef);
  }
    , [isAutosolverEnabled, solution, solutionStep]);

  function handleMove(tile: Tile) {
    if (!game) { return; }
    const newGameState = game.move(tile);
    setGame(newGameState);
  }

  function toggleAutosolver() {
    setIsAutosolverEnabled(state => !state);
  }

  return (
    <>
      <div>
        <p>JSON</p>
        <textarea rows={8} onChange={e => setTilesFromInput(e.target.value)} value={tilesFromInput} />
      </div>
      {game && <div className="game">
        <button disabled={!solution || !solution[solutionStep]} onClick={toggleAutosolver}>
          Run autosolver [{solutionStep} / {solution ? solution.length : '?'}]
        </button>

        <FifteenVisualizer game={game} handleMove={handleMove} />

        {solution && <div>
          <p>✅ Solution found</p>
          <ol>
            {solution.map((move, index) => <li key={index} className={index < solutionStep ? 'done' : ''}>{move.title}</li>)}
          </ol>
        </div>}

        <Solver game={game} onSolutionFound={setSolution} />
      </div>}

    </>
  )
}

export default App
