export type Character = {
  id: string
  name: string
  image: string
}

export type PlayerCharacter =
  Character & {
    total: number
    wins: number
    losses: number
  }

export type Player = {
  name: string
  color: string
  characters: PlayerCharacter[]
}