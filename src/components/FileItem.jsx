export function FileItem({ fileId, fileName, status, progress, errorMessage, onCancel, onRetry, onDelete, canCancel }) {
  const isUploading = status === 'uploading'
  const isSuccess = status === 'success'
  const isFailed = status === 'failed'

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-medium text-slate-800" title={fileName}>
          {fileName}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {isUploading && canCancel && (
            <button
              type="button"
              onClick={() => onCancel(fileId)}
              className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              Cancel
            </button>
          )}
          {isFailed && onRetry && (
            <button
              type="button"
              onClick={() => onRetry(fileId)}
              className="rounded px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
            >
              Retry
            </button>
          )}
          {   !isUploading && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(fileId)}
              className="rounded px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
              title="Remove from list"
            >
              Delete
            </button>
          )}
          <StatusType status={status} errorMessage={errorMessage} />
        </div>
      </div>
      {isUploading && (
        <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}

function StatusType({ status, errorMessage }) {
  if (status === 'uploading') {
    return (
      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
        Uploading…
      </span>
    )
  }
  if (status === 'success') {
    return (
      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
        Success
      </span>
    )
  }
  if (status === 'failed') {
    return (
      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800" title={errorMessage}>
        Failed
      </span>
    )
  }
  return null
}
