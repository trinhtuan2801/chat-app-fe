import axios from "axios";
import FileDownload from 'js-file-download';

export const axiosGet = async (url, params, isHeader = false) => {
  let result = await axios({
    method: 'get',
    url: url,
    params: params,
    headers: isHeader ? {
      "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
    } : null
  })
    .then(response => ({
      data: response.data,
      success: 1
    }))
    .catch(err => {
      console.log(err)
      return ({
        message: err.response?.data?.message,
        success: 0
      })
    })
  return result
}

export const axiosPost = async (url, params, isHeader = false, uploadFunc = () => { }) => {
  let result = await axios({
    method: 'post',
    url: url,
    // params: params,
    data: params,
    headers: isHeader ? {
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
      // "Content-Type": "application/json"
    } : null,
    onUploadProgress: uploadFunc
  })
    .then(response => ({
      data: response.data,
      success: 1
    }))
    .catch(err => {
      console.log(err)
      return ({
        message: err.response?.data?.message,
        success: 0
      })
    })

  return result
}

export const axiosDelete = async (url, params, isHeader = false) => {
  let result = await axios({
    method: 'delete',
    url: url,
    // params: params,
    data: params,
    headers: isHeader ? {
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
    } : null
  })
    .then(response => ({
      data: response.data,
      success: 1
    }))
    .catch(err => {
      console.log(err)
      return ({
        message: err.response?.data?.message,
        success: 0
      })
    })

  return result
}

export const axiosPatch = async (url, params, isHeader = false) => {
  let result = await axios({
    method: 'patch',
    url: url,
    // params: params ? ({ ...params }) : null,
    data: params,
    headers: isHeader ? {
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
    } : null
  })
    .then(response => ({
      data: response.data,
      success: 1
    }))
    .catch(err => {
      console.log(err)
      return ({
        message: err.response?.data?.message,
        success: 0
      })
    })

  return result
}

export const axiosPostFile = async (url, blobFile) => {
  let formData = new FormData()
  formData.append("fileToUpload", blobFile)
  let result = await axiosPost(url, formData, true)

  return result
}

export const axiosDownloadFile = async (url, fileName = 'chat-app-file') => {
  axios
    .get(url, {
      responseType: 'blob',
    }).then(response => {
      FileDownload(response.data, fileName);
    })
}
