export type Tile = {
  x: number;
  y: number;
  target: number | null;
  title: string;
};

export class FifteenGame {
  private empty: Tile;
  private size: number;

  constructor(private tiles: Readonly<Tile[]>) {
    this.size =
      tiles.reduce((acc, curr) => (curr.x > acc ? curr.x : acc), 0) + 1;
    const emptyCoords = identifyEmpty(this.size, tiles);
    this.empty = {
      ...emptyCoords,
      target: null,
      title: '',
    };
  }

  move(tile: Tile) {
    const movedTile = this.tiles.find(
      (localTile) => localTile.x === tile.x && localTile.y === tile.y
    );
    if (!movedTile) {
      throw new Error(`Moving invalid tile ${JSON.stringify(tile)}`);
    }

    if (!this.isSwapableWithEmpty(tile)) {
      throw new Error(
        `Swapping tile ${JSON.stringify(
          tile
        )} which is not next to empty tile ${JSON.stringify(this.empty)}`
      );
    }

    return new FifteenGame([
      ...this.tiles.filter((tile) => tile !== movedTile),
      { ...movedTile, x: this.empty.x, y: this.empty.y },
    ]);
  }

  getBoardForRender(): Tile[][] {
    const result = Array(this.size)
      .fill(0)
      .map((_, row) => {
        return [
          ...this.tiles.filter((tile) => tile.y === row),
          ...(row === this.empty.y ? [this.empty] : []),
        ].sort((a, b) => a.x - b.x);
      });
    return result;
  }

  getTiles(): Readonly<typeof this.tiles> {
    return this.tiles;
  }

  getSize() {
    return this.size;
  }

  hash() {
    return this.getBoardForRender()
      .map((row) => row.map((rowItem) => rowItem.target).join('-'))
      .join('\n');
  }

  isAllSettled() {
    return this.tiles.every(
      (tile) => tile.target === tile.x + tile.y * this.size
    );
  }

  private isSwapableWithEmpty(tile: Tile) {
    return (
      (Math.abs(tile.x - this.empty.x) === 1 && tile.y === this.empty.y) || // horizontal
      (Math.abs(tile.y - this.empty.y) === 1 && tile.x === this.empty.x) // vertical
    );
  }
}

function identifyEmpty(size: number, tiles: Readonly<Tile[]>) {
  const allPossibletiles = Array(size * size)
    .fill({})
    .map((_, index) => ({
      x: index % size,
      y: Math.floor(index / size),
    }));

  const empty = tiles.reduce((acc, curr) => {
    return acc.filter((coord) => {
      return !(coord.x === curr.x && coord.y === curr.y);
    });
  }, allPossibletiles);

  return empty[0];
}
