import { Article, AttachFile, Clear, Send } from "@mui/icons-material"
import { Box, IconButton, TextField, Typography } from "@mui/material"
import { useRef } from "react"
import { useContext, useEffect } from "react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { BASE_API, FILE_TYPE, SECTION_BORDER_COLOR, textEllipsis } from "../../../constants"
import { setRepliedMessage } from "../../../redux/friendListReducer"
import { getSocketHeaders, WebsocketContext } from "../../../WebsocketContext/WebsocketContext"
import { axiosDownloadFile, axiosPost } from '../../../utils/axiosUtils'
import useUploadFile from "../../../utils/useUploadFile"
import { useMemo } from "react"
import { useSnackbar } from "notistack"
import { MentionsInput, Mention } from 'react-mentions'

const initDisplayedFile = {
  name: '',
  url: '',
  type: '',
}

const fake_users = [
  {
    id: "isaac",
    display: "Isaac Newton",
  },
  {
    id: "sam",
    display: "Sam Victor",
  },
  {
    id: "emma",
    display: "emmanuel@nobody.com",
  },
];

const InputBox = () => {

  const [message, setMessage] = useState('')
  const socket = useContext(WebsocketContext)
  const { conversation_id, my_id, replied_message } = useSelector(state => state.friendList)
  const [shiftPressed, setShiftPressed] = useState(false)
  const lastCharRef = useRef('')
  const dispatch = useDispatch()
  const inputRef = useRef()
  const [blobFile, setBlobFile] = useState(null)
  const [displayedFile, setDisplayedFile] = useState(initDisplayedFile)
  const { file, error, progress, loading } = useUploadFile(`${BASE_API}/files`, blobFile, displayedFile?.name)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    reset()
  }, [conversation_id])

  const reset = () => {
    setMessage('')
    setDisplayedFile(initDisplayedFile)
    setBlobFile(null)
    setShiftPressed(false)
  }

  const sendMessage = () => {
    console.log(message)
    if (message) {
      socket.emit(`newMessage`, {
        conversation_id,
        message,
        parent_message_id: replied_message?.id,
        file_id: null,
        headers: getSocketHeaders()
      })
    }
    if (file?.id) {
      socket.emit(`newMessage`, {
        conversation_id,
        message: '',
        parent_message_id: replied_message?.id,
        file_id: file?.id,
        headers: getSocketHeaders()
      })
    }

    reset()
    dispatch(setRepliedMessage(null))
  }

  const stopReplied = () => {
    dispatch(setRepliedMessage(null))
  }

  useEffect(() => {
    if (replied_message) {
      inputRef.current.focus()
    }
  }, [replied_message])

  const uploadFile = async (e) => {
    console.log(e.target.files[0])
    if (!e.target.files) return

    const blobFile = e.target.files[0]
    setBlobFile(blobFile)

    let type = FILE_TYPE.RAW
    if (blobFile.type.includes('image/')) type = FILE_TYPE.IMAGE
    else if (blobFile.type.includes('video/')) type = FILE_TYPE.VIDEO
    setDisplayedFile(prev => ({ ...prev, type, name: blobFile.name }))

    if (type === FILE_TYPE.IMAGE) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setDisplayedFile(prev => ({ ...prev, url: e.target.result }))
      }
      reader.readAsDataURL(blobFile)
    }

    e.target.value = ''
  }

  useEffect(() => {
    console.log('loading', loading)
    if (file && !loading) {
      console.log(file)
      const { url, type, name } = file
      setDisplayedFile({ url, type, name })
    }
  }, [loading])

  useEffect(() => {
    if (error) {
      enqueueSnackbar('Lỗi khi upload', { variant: 'error' })
      reset()
    }
  }, [error])

  const isRepliedMessageMine = replied_message?.user_id === my_id

  const startAdornment = useMemo(() => {
    if (!displayedFile.type) return null
    // if (displayedFile.type === FILE_TYPE.IMAGE) return (
    return (
      <ThumnailFile
        name={displayedFile.name}
        url={displayedFile.url}
        type={displayedFile.type}
        deleteFile={() => {
          setDisplayedFile(initDisplayedFile)
          setBlobFile(null)
        }}
        loading={loading}
        progress={progress}
      />
    )
  }, [displayedFile, loading, progress])

  const sendable = Boolean((message || file) && !loading)

  const replied_file_type = replied_message?.file?.type

  const replied_file_type_str = replied_file_type === FILE_TYPE.IMAGE ? 'Hình ảnh' : 'File'

  return (
    <Box width='100%'>
      {replied_message &&
        <Box
          paddingLeft={2}
          paddingRight={0.5}
          paddingTop={1}
          borderTop={`1px solid ${SECTION_BORDER_COLOR}`}
          display='flex'
          justifyContent='space-between'
        >
          <Box marginRight={1}>
            <Typography
              variant='caption'
              component='p'
            >
              Đang trả lời&nbsp;
              {replied_message.mine ?
                'chính mình' :
                <span style={{ fontWeight: isRepliedMessageMine ? 'normal' : '500' }}>
                  {isRepliedMessageMine ? 'chính mình' : replied_message.user_name}
                </span>
              }
            </Typography>
            <Typography
              variant='caption'
              color='GrayText'
              sx={textEllipsis(2)}
            >
              {!!replied_message.file ?
                <>
                  {replied_file_type_str}
                </>
                :
                <>
                  {replied_message?.message}
                </>
              }
            </Typography>
          </Box>
          <IconButton
            size='small'
            sx={{
              height: 'fit-content',
              width: 'fit-content',
              color: 'black',
              position: 'relative',
              bottom: '4px'
            }}
            onClick={stopReplied}
          >
            <Clear fontSize='inherit' />
          </IconButton>
        </Box>
      }
      <Box width='100%' display='flex' alignItems='flex-end' paddingX={1} paddingY={2}>
        <SmolButton icon={<AttachFile fontSize='inherit' />} >
          <input
            type="file"
            // accept="image/*"
            style={{ width: '100%', height: '100%', cursor: 'pointer', opacity: 0, position: 'absolute', top: 0, left: 0 }}
            onChange={uploadFile}
          />
        </SmolButton>
        <Box marginLeft={1} />
        <TextField
          size='small'
          placeholder="Aa"
          fullWidth
          multiline
          maxRows={6}
          value={message}
          onChange={e => {
            if (shiftPressed || lastCharRef.current !== 'Enter') {
              setMessage(e.target.value)
            }
          }}
          onKeyDown={e => {
            const char = e.code
            lastCharRef.current = char
            if (char === 'ShiftLeft') setShiftPressed(true)
            else if (char === 'Enter' && !shiftPressed && sendable) sendMessage()
          }}
          onKeyUp={e => {
            if (e.code === 'ShiftLeft') setShiftPressed(false)
          }}
          inputRef={inputRef}
          sx={{
            ".MuiOutlinedInput-root": {
              // paddingTop: "1rem",
              flexDirection: "column",
              alignItems: 'flex-start',
              backgroundColor: `#F0F2F5`,
              borderRadius: '20px',
              border: 'none !important'
            },
            fieldset: {
              borderColor: 'transparent !important'
            },
            textarea: {
              border: 'none !important',
              outline: 'none'
            },
          }}
          InputProps={{
            startAdornment: startAdornment,
            inputComponent: CustomInput
          }}
        />

        <Box marginLeft={1} />
        <IconButton
          size='small'
          sx={{ padding: 1, width: 'fit-content', height: 'fit-content', marginBottom: '4px' }}
          disabled={!sendable}
          color='primary'
          onClick={sendMessage}
        >
          <Send fontSize='inherit' />
        </IconButton>
      </Box>
    </Box>
  )
}

export default InputBox

const SmolButton = ({ icon, onClick, children }) => {
  return (
    <IconButton
      size='small'
      sx={{ padding: 1, width: 'fit-content', height: 'fit-content', marginBottom: '4px' }}
      onClick={onClick}
      color='primary'
    >
      {icon}
      {children}
    </IconButton>
  )
}

const ThumnailFile = ({ name, url, type, deleteFile, loading, progress }) => {
  return (
    <Box
      position='relative'
      width='fit-content'
      height='48px'
      marginBottom={1}
      marginTop={0.5}
    >
      {type === FILE_TYPE.IMAGE ?
        <img
          src={url}
          style={{
            height: '100%',
            width: '48px',
            objectFit: 'cover',
            borderRadius: '10px',
          }}
        />
        :
        <FileMessage
          name={name}
          url={url}
        />
      }
      {loading &&
        <Box
          width='100%'
          height='100%'
          position='absolute'
          top='0'
          left='0'
          borderRadius='10px'
          overflow='hidden'
        >
          <Box
            position='absolute'
            bottom='0'
            bgcolor='#606060'
            width='100%'
            height='5px'
            overflow='hidden'
          >
            <Box
              width={`${progress}%`}
              height='100%'
              bgcolor='#0084ff'
              borderRadius='10px'
            >
            </Box>
          </Box>
        </Box>
      }

      <IconButton
        sx={{
          position: 'absolute',
          right: '-8px',
          top: '-8px',
          backgroundColor: 'white !important',
          color: 'black',
          border: `1px solid ${SECTION_BORDER_COLOR}`,
          padding: 0,
          fontSize: '18px',
          width: '24px',
          height: '24px'
        }}
        size='small'
        onClick={deleteFile}
      >
        <Clear fontSize="inherit"></Clear>
      </IconButton>
    </Box>
  )
}

export const FileMessage = ({ name, url, variant = 'thumbnail' }) => {
  return (
    <Box
      display='flex'
      height='48px'
      bgcolor='#d6d9dd'
      borderRadius={variant === 'thumbnail' ? '10px' : '18px'}
      width='128px'
      paddingX={1}
      alignItems='center'
      sx={{ cursor: 'pointer', opacity: variant === 'thumbnail' ? 1 : 0.5 }}
      onClick={() => axiosDownloadFile(url, name)}
    >
      <Box display='flex'>
        <Box
          bgcolor='white'
          width='32px'
          height='32px'
          borderRadius='50%'
          display='flex'
          justifyContent='center'
          alignItems='center'
        >
          <Article fontSize='small' />
        </Box>
      </Box>
      <Box marginLeft={1} />
      <Typography
        variant="caption"
        sx={{
          fontWeight: '600',
          ...textEllipsis(1),
        }}
      >{name}</Typography>
    </Box>
  )
}

const CustomInput = ({ inputRef, ...rest }) => {
  return (
    <MentionsInput
      inputRef={inputRef}
      {...rest}
      // style={MentionsInputStyle}
    >
      <Mention
        data={fake_users}
        style={{backgroundColor: 'cyan'}}
      />
    </MentionsInput>
  )
}

const MentionsInputStyle = {
  control: {
    backgroundColor: '#fff',
    fontSize: 14,
    fontWeight: 'normal',
  },

  '&multiLine': {
    control: {
      fontFamily: 'monospace',
      minHeight: 63,
    },
    highlighter: {
      padding: 9,
      border: '1px solid transparent',
    },
    input: {
      padding: 9,
      border: '1px solid silver',
    },
  },

  '&singleLine': {
    display: 'inline-block',
    width: 180,

    highlighter: {
      padding: 1,
      border: '2px inset transparent',
    },
    input: {
      padding: 1,
      border: '2px inset',
    },
  },

  suggestions: {
    list: {
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 14,
    },
    item: {
      padding: '5px 15px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',
      '&focused': {
        backgroundColor: '#cee4e5',
      },
    },
  },
}