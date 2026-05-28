type Props = {
  moveMode: boolean

  onToggleMoveMode: () => void

  onUndo: () => void
}

function TopControls({
  moveMode,
  onToggleMoveMode,
  onUndo,
}: Props) {
  return (
    <div className="top-controls">
      <button
        className={`mode-button ${
          moveMode ? 'active' : ''
        }`}
        onClick={onToggleMoveMode}
      >
        {moveMode
          ? '移動モードON'
          : '移動モードOFF'}
      </button>

      <button
        className="undo-button"
        onClick={onUndo}
      >
        1つ戻る
      </button>
    </div>
  )
}

export default TopControls