import {
  useDroppable,
} from '@dnd-kit/core'

import CharacterCard from './CharacterCard'

import type {
  Player,
} from '../types/game'

type Props = {
  player: Player

  moveMode: boolean

  onCharacterClick: (
    playerName: string,
    characterId: string
  ) => void
}

function PlayerRow({
  player,
  moveMode,
  onCharacterClick,
}: Props) {
  const { setNodeRef } = useDroppable({
    id: player.name,
  })

  return (
    <div className="row">
      <div
        className="player-name"
        style={{
          backgroundColor: player.color,
        }}
      >
        {player.name}
      </div>

      <div
        ref={setNodeRef}
        className="character-area"
      >
        {player.characters.map(
          (character) => (
            <CharacterCard
              key={character.id}
              character={character}
              moveMode={moveMode}
              onClick={() =>
                onCharacterClick(
                  player.name,
                  character.id
                )
              }
            />
          )
        )}
      </div>
    </div>
  )
}

export default PlayerRow