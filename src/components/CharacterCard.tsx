import {
  useDraggable,
} from '@dnd-kit/core'

import type {
  Character,
  PlayerCharacter,
} from '../types/game'

type Props = {
  character: Character | PlayerCharacter

  moveMode: boolean

  onClick?: () => void
}

function CharacterCard({
  character,
  moveMode,
  onClick,
}: Props) {
  const isPlayerCharacter =
    'total' in character

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: character.id,

    disabled:
      isPlayerCharacter && !moveMode,
  })

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined

  const winRate = isPlayerCharacter
    ? character.total === 0
      ? 0
      : Math.round(
          (character.wins /
            character.total) *
            100
        )
    : 0

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`character-card ${
        isDragging ? 'dragging' : ''
      }`}
    >
      <img
        src={character.image}
        alt={character.name}
        className="character-image"
      />

      {isPlayerCharacter && (
        <div className="character-stats">
          <div className="stat-total">
            {character.total}
          </div>

          <div className="stat-wins">
            {character.wins}
          </div>

          <div className="stat-losses">
            {character.losses}
          </div>

          <div className="stat-rate">
            {winRate}%
          </div>
        </div>
      )}
    </div>
  )
}

export default CharacterCard