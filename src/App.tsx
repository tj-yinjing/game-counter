import './App.css'

import { useState } from 'react'

import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'

import {
  characters,
} from './data/characters'

import type {
  Player,
} from './types/game'

import CharacterCard from './components/CharacterCard'
import PlayerRow from './components/PlayerRow'
import ResultModal from './components/ResultModal'
import TopControls from './components/TopControls'

function App() {
  const [players, setPlayers] = useState<
    Player[]
  >([
    {
      name: '田中',
      color: '#a8e66d',
      characters: [],
    },
    {
      name: '名和田',
      color: '#f2b676',
      characters: [],
    },
    {
      name: '高野',
      color: '#6fa8dc',
      characters: [],
    },
    {
      name: '罰',
      color: '#e5e56c',
      characters: [],
    },
  ])

  const [
    selectedCharacter,
    setSelectedCharacter,
  ] = useState<{
    playerName: string
    characterId: string
  } | null>(null)

  const [moveMode, setMoveMode] =
    useState(false)

  const [history, setHistory] = useState<
    Player[][]
  >([])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  /* =========================
     DRAG
  ========================= */

  const handleDragEnd = (
    event: DragEndEvent
  ) => {
    const { active, over } = event

    if (!over) return

    const character = characters.find(
      (c) => c.id === active.id
    )

    /* =========================
       CHARACTER POOL
    ========================= */

    if (character) {
      setPlayers((prev) => {
        const removedPlayers = prev.map(
          (player) => ({
            ...player,
            characters:
              player.characters.filter(
                (c) => c.id !== character.id
              ),
          })
        )

        return removedPlayers.map((player) => {
          if (player.name === over.id) {
            return {
              ...player,
              characters: [
                ...player.characters,
                {
                  ...character,
                  total: 0,
                  wins: 0,
                  losses: 0,
                },
              ].sort(
                (a, b) =>
                  b.total - a.total
              ),
            }
          }

          return player
        })
      })

      return
    }

    /* =========================
       PLAYER POOL
    ========================= */

    const existingCharacter = players
      .flatMap((player) => player.characters)
      .find((c) => c.id === active.id)

    if (!existingCharacter) return

    const sourcePlayer = players.find(
      (player) =>
        player.characters.some(
          (c) => c.id === active.id
        )
    )

    /* 同一プレイヤー内移動禁止 */

    if (sourcePlayer?.name === over.id) {
      return
    }

    setPlayers((prev) => {
      const removedPlayers = prev.map(
        (player) => ({
          ...player,
          characters:
            player.characters.filter(
              (c) =>
                c.id !== existingCharacter.id
            ),
        })
      )

      return removedPlayers.map((player) => {
        if (player.name === over.id) {
          return {
            ...player,
            characters: [
              ...player.characters,
              existingCharacter,
            ].sort(
              (a, b) =>
                b.total - a.total
            ),
          }
        }

        return player
      })
    })
  }

  /* =========================
     MATCH RESULT
  ========================= */

  const handleMatchResult = (
    result: 'win' | 'loss'
  ) => {
    if (!selectedCharacter) return

    setHistory((prev) => [
      ...prev,
      structuredClone(players),
    ])

    setPlayers((prev) =>
      prev.map((player) => {
        if (
          player.name !==
          selectedCharacter.playerName
        ) {
          return player
        }

        return {
          ...player,

          characters: player.characters
            .map((character) => {
              if (
                character.id !==
                selectedCharacter.characterId
              ) {
                return character
              }

              return {
                ...character,

                total:
                  character.total + 1,

                wins:
                  result === 'win'
                    ? character.wins + 1
                    : character.wins,

                losses:
                  result === 'loss'
                    ? character.losses + 1
                    : character.losses,
              }
            })
            .sort(
              (a, b) =>
                b.total - a.total
            ),
        }
      })
    )

    setSelectedCharacter(null)
  }

  /* =========================
     UNDO
  ========================= */

  const handleUndo = () => {
    const previous =
      history[history.length - 1]

    if (!previous) return

    setPlayers(previous)

    setHistory((prev) =>
      prev.slice(0, -1)
    )
  }

  /* =========================
     USED IDS
  ========================= */

  const usedCharacterIds =
    players.flatMap((player) =>
      player.characters.map(
        (character) => character.id
      )
    )

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <div className="app">
        <TopControls
          moveMode={moveMode}
          onToggleMoveMode={() =>
            setMoveMode(!moveMode)
          }
          onUndo={handleUndo}
        />

        {players.map((player) => (
          <PlayerRow
            key={player.name}
            player={player}
            moveMode={moveMode}
            onCharacterClick={(
              playerName,
              characterId
            ) =>
              setSelectedCharacter({
                playerName,
                characterId,
              })
            }
          />
        ))}

        <div className="character-pool">
          <div className="pool-grid">
            {characters
              .filter(
                (character) =>
                  !usedCharacterIds.includes(
                    character.id
                  )
              )
              .map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  moveMode={true}
                />
              ))}
          </div>
        </div>
      </div>

      {selectedCharacter && (
        <ResultModal
          onWin={() =>
            handleMatchResult('win')
          }
          onLoss={() =>
            handleMatchResult('loss')
          }
          onClose={() =>
            setSelectedCharacter(null)
          }
        />
      )}
    </DndContext>
  )
}

export default App