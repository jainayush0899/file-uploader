import { FileItem } from './FileItem'

/**
 * List of files with upload status. Each file is independent (parallel uploads).
 */
export function FileList({ files, onCancel, onRetry, onDelete }) {
  if (!files?.length) return null

  return (
    <ul className="flex flex-col gap-3">
      {files.map((item) => (
        <li key={item.id}>
          <FileItem
            fileId={item.id}
            fileName={item.file.name}
            status={item.status}
            progress={item.progress}
            errorMessage={item.errorMessage}
            onCancel={onCancel}
            onRetry={onRetry}
            onDelete={onDelete}
            canCancel={item.status === 'uploading'}
          />
        </li>
      ))}
    </ul>
  )
}
