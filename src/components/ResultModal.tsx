type Props = {
  onWin: () => void

  onLoss: () => void

  onClose: () => void
}

function ResultModal({
  onWin,
  onLoss,
  onClose,
}: Props) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>対戦結果を追加</h2>

        <div className="modal-buttons">
          <button
            className="win-button"
            onClick={onWin}
          >
            勝ち
          </button>

          <button
            className="loss-button"
            onClick={onLoss}
          >
            負け
          </button>
        </div>

        <button
          className="cancel-button"
          onClick={onClose}
        >
          キャンセル
        </button>
      </div>
    </div>
  )
}

export default ResultModal