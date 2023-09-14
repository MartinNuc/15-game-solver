import { FifteenGame, Tile } from "./FifteenGame";

type Props = {
  game: FifteenGame,
  handleMove?: (tile: Tile) => void
};

export function FifteenVisualizer({ game, handleMove }: Props) {
  return <div>
    {game.getBoardForRender().map(row => (
      <div className="row">
        {row.map(tile =>
          <button key={tile.title} className="tile" onClick={() => handleMove?.(tile)}>
            {tile.title}
          </button>
        )}
      </div>
    ))}
  </div>
}