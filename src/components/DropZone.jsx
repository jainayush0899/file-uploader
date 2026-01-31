import { useCallback, useRef } from 'react'

/**
 * Drag-and-drop zone + file input for selecting one or more files.
 */
export function DropZone({ onFilesSelected, disabled }) {
  const inputRef = useRef(null)

  const handleFiles = useCallback(
    (fileList) => {
      if (!fileList?.length) return
      const files = Array.from(fileList)
      onFilesSelected(files)
    },
    [onFilesSelected]
  )

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (disabled) return
      handleFiles(e.dataTransfer?.files)
    },
    [disabled, handleFiles]
  )

  const onDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const onClick = useCallback(() => {
    if (disabled) return
    inputRef.current?.click()
  }, [disabled])

  const onChange = useCallback(
    (e) => {
      handleFiles(e.target.files)
      e.target.value = ''
    },
    [handleFiles]
  )

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      className={`
        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
        ${disabled ? 'opacity-60 cursor-not-allowed border-slate-400 bg-slate-100' : 'border-slate-400 hover:border-indigo-500 hover:bg-indigo-50/50'}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={onChange}
        disabled={disabled}
      />
      <p className="text-slate-600 font-medium">Drag & drop files here, or click to select</p>
      <p className="text-slate-500 text-sm mt-1">No limit on number or size</p>
    </div>
  )
}
