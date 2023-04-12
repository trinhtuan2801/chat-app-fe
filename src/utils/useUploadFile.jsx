import { useEffect, useState } from "react"
import { axiosPost } from "./axiosUtils"

const useUploadFile = (url, blobFile, fileName) => {
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setFile(null)
    setProgress(0)
    setError(false)
    setLoading(true)

    if (!blobFile) {
      setLoading(false)
      return
    }

    const uploadFunc = (progressEvent) => {
      const { loaded, total } = progressEvent
      let percent = Math.floor(loaded * 100 / total)
      setProgress(percent)
    }

    const upload = async () => {
      let formData = new FormData()
      formData.append("file", blobFile)
      formData.append("filename", fileName)
      let response = await axiosPost(url, formData, true, uploadFunc)
      if (!response.success) {
        setError(true)
        setLoading(false)
        setProgress(0)
        return
      }
      setFile(response.data)
      setLoading(false)
      setProgress(0)
    }

    upload()
  }, [url, blobFile])

  return { file, error, progress, loading }
}

export default useUploadFile