import { useCallback, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { DropZone } from './components/DropZone'
import { FileList } from './components/FileList'
import { simulateUpload } from './utils/uploadSimulator'

let nextId = 0
function generateId() {
  return `file-${++nextId}-${Date.now()}`
}

export default function App() {
  const [files, setFiles] = useState([])
  const abortRef = useRef({})

  const updateFile = useCallback((id, updates) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)))
  }, [])

  const runUpload = useCallback(
    (id, file) => {
      const controller = new AbortController()
      abortRef.current[id] = controller

      simulateUpload(file, (progress) => updateFile(id, { progress }), controller.signal)
        .then((result) => {
          if (result.success) {
            updateFile(id, { status: 'success', progress: 100 })
            toast.success(`File ${file.name} uploaded successfully!`)
          } else {
            updateFile(id, { status: 'failed', errorMessage: result.message })
            toast.error(`Failed to upload ${file.name} — ${result.message}`)
          }
        })
        .catch((err) => {
          const message = err?.message || 'Upload failed'
          updateFile(id, { status: 'failed', errorMessage: message })
          if (message !== 'Upload cancelled') {
            toast.error(`Failed to upload ${file.name} — ${message}`)
          }
        })
        .finally(() => {
          delete abortRef.current[id]
        })
    },
    [updateFile]
  )

  const onFilesSelected = useCallback(
    (selectedFiles) => {
      const newItems = selectedFiles.map((file) => ({
        id: generateId(),
        file,
        status: 'uploading',
        progress: 0,
        errorMessage: null,
      }))
      setFiles((prev) => [...prev, ...newItems])
      newItems.forEach(({ id, file }) => runUpload(id, file))
    },
    [runUpload]
  )

  const onCancel = useCallback((fileId) => {
    const controller = abortRef.current[fileId]
    if (controller) controller.abort()
  }, [])

  const onRetry = useCallback(
    (fileId) => {
      const item = files.find((f) => f.id === fileId)
      if (!item || item.status !== 'failed') return
      updateFile(fileId, { status: 'uploading', progress: 0, errorMessage: null })
      runUpload(fileId, item.file)
    },
    [files, updateFile, runUpload]
  )

  const onDelete = useCallback((fileId) => {
    const controller = abortRef.current[fileId]
    if (controller) controller.abort()
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-2xl font-bold text-slate-800">File Uploader</h1>
        <p className="mb-6 text-slate-600">Select multiple files or drag & drop.</p>

        <DropZone onFilesSelected={onFilesSelected} />
        <div className="mt-6">
          <FileList files={files} onCancel={onCancel} onRetry={onRetry} onDelete={onDelete} />
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}
