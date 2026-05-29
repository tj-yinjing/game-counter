// PlayerRow.tsx
import { useDroppable } from '@dnd-kit/core'
import CharacterCard from './CharacterCard'
import type { Player } from '../types/game'

type Props = {
  player: Player
  moveMode: boolean
  onCharacterClick: (playerName: string, characterId: string) => void
}

function PlayerRow({ player, moveMode, onCharacterClick }: Props) {
  const { setNodeRef } = useDroppable({
    id: player.name,
  })

  // プレイヤー全体の合計戦績
  const total = player.characters.reduce((sum, c) => sum + c.total, 0)
  const wins = player.characters.reduce((sum, c) => sum + c.wins, 0)
  const losses = player.characters.reduce((sum, c) => sum + c.losses, 0)
  const winRate = total === 0 ? 0 : Math.round((wins / total) * 100)

  return (
    <div className="row">
      <div className="player-name" style={{ backgroundColor: player.color }}>
        <div className="player-name-text">{player.name}</div>

        <div className="player-stats">
          <span className="stat-total">{total}</span>
          <span className="stat-wins">{wins}</span>
          <span className="stat-losses">{losses}</span>
          <span className="stat-rate">{winRate}%</span>
        </div>
      </div>

      <div ref={setNodeRef} className="character-area">
        {player.characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            moveMode={moveMode}
            onClick={() => onCharacterClick(player.name, character.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default PlayerRow