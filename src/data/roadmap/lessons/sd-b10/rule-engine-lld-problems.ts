import type { LessonEntry } from "@/types/roadmap";

export const RULE_ENGINE_LLD_PROBLEMS: LessonEntry = {
  track: "system-design",
  section: "Low-level design",
  subsection: {
    title: "Rule-engine problems: chess, Snake and Ladder",
    slug: "rule-engine-lld-problems",
    lesson: {
      summary: "Game problems are about where the rules live: keep the board dumb, put movement in per-piece or per-cell rules, and separate the turn loop.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "Where do the rules live?" },
        { type: "p", text: "Game problems look huge but have a small structure: a **board** that holds state, **pieces or cells** that carry rules, and a **game** that runs turns and detects the end. The common mistake is one giant `Game` class full of `if (piece === \"knight\")`. Put each rule next to the thing it describes." },
        { type: "h2", text: "Snake and Ladder" },
        { type: "p", text: "Entities: `Board` (size, jumps), `Dice`, `Player` (name, position), `Game`. Snakes and ladders are the same thing: a jump from one cell to another. Model them as a `Map<number, number>` and the board needs no special cases." },
        {
          type: "code",
          language: "typescript",
          code: `interface Dice { roll(): number; }

class Board {
  constructor(readonly size: number, private readonly jumps: ReadonlyMap<number, number>) {}

  // returns the final cell after any snake or ladder
  resolve(cell: number): number {
    return this.jumps.get(cell) ?? cell;
  }
}

class Player {
  constructor(readonly name: string, public position = 0) {}
}

class SnakeAndLadder {
  private turn = 0;
  constructor(private readonly board: Board, private readonly dice: Dice, private readonly players: Player[]) {}

  play(): Player {
    for (;;) {
      const player = this.players[this.turn % this.players.length];
      this.turn += 1;
      const target = player.position + this.dice.roll();
      if (target > this.board.size) continue; // needs an exact roll
      player.position = this.board.resolve(target);
      if (player.position === this.board.size) return player;
    }
  }
}`,
        },
        { type: "p", text: "Dice is an interface so tests can pass a scripted roller and the game is deterministic. Variants (two dice, extra turn on a six, a snake at the final cell) change `Dice` or the turn loop, not the board. Validate at setup that no jump starts on the last cell and that jumps do not form a loop." },
        { type: "h2", text: "Chess" },
        { type: "p", text: "Entities: `Board` (8x8 grid of optional pieces), `Piece` (colour, position), `Move`, `Game`. Give each piece type its own movement rule through a common interface. The piece reports candidate moves by geometry; the game then filters out moves that leave its own king in check." },
        {
          type: "code",
          language: "typescript",
          code: `interface Square { readonly row: number; readonly col: number; }

abstract class Piece {
  constructor(readonly white: boolean) {}
  abstract candidateMoves(from: Square, board: Board): Square[];
}

class Knight extends Piece {
  private static readonly OFFSETS = [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]];

  candidateMoves(from: Square, board: Board): Square[] {
    return Knight.OFFSETS
      .map(([dr, dc]) => ({ row: from.row + dr, col: from.col + dc }))
      .filter((s) => board.inBounds(s) && board.pieceAt(s)?.white !== this.white);
  }
}

class Board {
  private readonly grid: (Piece | undefined)[][] =
    Array.from({ length: 8 }, () => Array<Piece | undefined>(8).fill(undefined));
  inBounds(s: Square): boolean { return s.row >= 0 && s.row < 8 && s.col >= 0 && s.col < 8; }
  pieceAt(s: Square): Piece | undefined { return this.grid[s.row][s.col]; }
}`,
        },
        { type: "p", text: "Sliding pieces (rook, bishop, queen) share a helper that walks a direction until blocked. Special rules (castling, en passant, promotion) live in the `Game`, since they depend on history, not just geometry. Check, checkmate and stalemate all reduce to \"does this player have any legal move, and is the king attacked\"." },
        {
          type: "table",
          head: ["Rule", "Belongs in", "Reason"],
          rows: [
            ["How a knight moves", "`Knight`", "depends on piece type only"],
            ["Blocked by a piece", "`Board` lookup", "depends on board state"],
            ["Own king in check", "`Game` filter", "depends on the whole position"],
            ["Snake or ladder jump", "`Board.resolve`", "depends on the cell only"],
            ["Whose turn, who won", "`Game`", "match flow, not geometry"],
          ],
        },
        { type: "callout", tone: "tip", title: "Scope it out loud", text: "A full chess engine does not fit in 90 minutes. Offer a plan: board, all piece movements, turn loop and check detection first, then castling, en passant and promotion as stated extensions. Clear scoping beats a half-finished everything." },
      ],
      references: [
        { title: "Rules of chess (Wikipedia)", url: "https://en.wikipedia.org/wiki/Rules_of_chess" },
        { title: "Snakes and ladders (Wikipedia)", url: "https://en.wikipedia.org/wiki/Snakes_and_ladders" },
        { title: "Strategy pattern (Wikipedia)", url: "https://en.wikipedia.org/wiki/Strategy_pattern" },
      ],
    },
    points: [
      { id: "sd.rule-engine-lld-problems.rules-next-to-data", title: "Rules next to the thing they describe", detail: "Put movement in the piece type and jumps in the board instead of one large Game class full of conditionals. Each rule then changes in one place and can be tested alone.", question: "Where would you add a new piece type that moves like a knight and a king combined, and what else would you edit?" },
      { id: "sd.rule-engine-lld-problems.snake-ladder-as-jumps", title: "Snakes and ladders as one concept", detail: "Both are a jump from one cell to another, so a single map from start cell to end cell covers them. Injecting the dice makes the game deterministic in tests.", question: "How do you validate a board where a ladder lands on the start of a snake that leads back to the ladder?" },
      { id: "sd.rule-engine-lld-problems.legal-moves-filter", title: "Candidate moves versus legal moves", detail: "A piece reports moves from geometry and blockers, and the game removes any move that leaves the mover's own king attacked. Checkmate and stalemate both ask whether any legal move remains.", question: "What separates checkmate from stalemate when the player has no legal move?" },
    ],
  },
};
