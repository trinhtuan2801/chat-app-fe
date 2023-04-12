import { PushPin, Reply } from "@mui/icons-material"
import { Box, IconButton, Typography } from "@mui/material"
import { useContext } from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { FILE_TYPE } from "../../../constants"
import { setRepliedMessage } from "../../../redux/friendListReducer"
import { getSocketHeaders, WebsocketContext } from "../../../WebsocketContext/WebsocketContext"
import { FileMessage } from "./InputBox"

const Message = ({
  oldestMessageRef,
  // id,
  // message,
  // user_id,
  // user_name,
  // parent_message,
  _data
}) => {
  const { id, message, user_id, user_name, parent_message, file } = _data
  const { my_id, conversation_id } = useSelector(state => state.friendList)
  const [hover, setHover] = useState(false)
  const dispatch = useDispatch()
  const socket = useContext(WebsocketContext)
  const replyThis = () => {
    dispatch(setRepliedMessage(_data))

  }

  const pinMessage = () => {
    socket.emit('pinMessage', {
      conversation_id,
      message_id: id,
      headers: getSocketHeaders()
    })
  }

  const isMessageMine = user_id === my_id
  const isParentMessageMine = parent_message?.user_id === my_id

  const parent_file = parent_message?.file
  const parent_file_type = parent_file?.type

  return (
    <Box
      width='100%'
      // display='flex'
      // flexDirection={mine ? 'row-reverse' : 'row'}
      paddingX={2}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div ref={oldestMessageRef} />
      {!isMessageMine && !parent_message &&
        <Typography
          variant="caption"
          color="GrayText"
          sx={{ paddingLeft: 1 }}
        >
          {user_name}
        </Typography>
      }
      {parent_message &&
        <>
          <Typography
            variant="caption"
            color="GrayText"
            sx={{
              paddingLeft: 1,
              display: 'flex',
              justifyContent: isMessageMine ? 'flex-end' : 'flex-start'
            }}
          >
            <Reply fontSize="inherit" />&nbsp;
            {isMessageMine ? 'Bạn' : user_name} đã trả lời&nbsp;
            {parent_message.user_id === user_id ? 'chính mình' : isParentMessageMine ? 'bạn' : parent_message.user_name}
          </Typography>
          <Box
            marginBottom='-17px'
            width='100%'
            display='flex'
            justifyContent={isMessageMine ? 'flex-end' : 'flex-start'}
          >
            {!!parent_message.file ?
              <>
                {parent_file_type === FILE_TYPE.IMAGE ?
                  <ImageMessage
                    url={parent_file.url}
                    variant='replied'
                  />
                  :
                  <FileMessage
                    url={parent_file.url}
                    name={parent_file.name}
                    variant='replied'
                  />
                }
              </>
              :
              <Box
                paddingX={'12px'}
                paddingY={'8px'}
                borderRadius='18px'
                bgcolor={'#F6F9FA'}
              >
                <Typography
                  sx={{ whiteSpace: 'pre-wrap', paddingBottom: '12px' }}
                  color='GrayText'
                  variant='body2'
                >{parent_message.message}</Typography>
              </Box>
            }

          </Box>
        </>
      }
      <Box
        display='flex'
        flexDirection={isMessageMine ? 'row-reverse' : 'row'}
        alignItems='center'
        position='relative' //remove wrong image opacity
      >
        {!!file ?
          <>
            {file.type === FILE_TYPE.IMAGE ?
              <ImageMessage url={file.url} />
              :
              <FileMessage name={file.name} url={file.url} />
            }
          </>
          :
          <Box
            paddingX={'12px'}
            paddingY={'8px'}
            borderRadius='18px'
            bgcolor={isMessageMine ? '#0084FF' : '#E4E6EB'}
            color={isMessageMine ? 'white' : 'black'}
          >
            {/**Pre-wrap để hiện thị \n */}
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>{message}</Typography>
          </Box>
        }

        <Box marginLeft={1} />
        <Box width='120px'
          display='flex'
          flexDirection={isMessageMine ? 'row-reverse' : 'row'}
        >
          {hover &&
            <>
              <IconButton
                size='small'
                sx={{ height: 'fit-content', width: 'fit-content' }}
                onClick={replyThis}
              >
                <Reply fontSize='inherit' />
              </IconButton>
              <IconButton
                size='small'
                sx={{ height: 'fit-content', width: 'fit-content' }}
                onClick={pinMessage}
              >
                <PushPin fontSize='inherit' />
              </IconButton>
            </>
          }
        </Box>
      </Box>

    </Box>
  )
}

export default Message

export const ImageMessage = ({ url, variant = 'thumbnail' }) => {
  return (
    <img
      style={{
        maxHeight: variant === 'thumbnail' ? '200px' : '100px',
        maxWidth: variant === 'thumbnail' ? '200px' : '100px',
        objectFit: 'contain',
        cursor: 'pointer',
        borderRadius: '18px',
        opacity: variant === 'thumbnail' ? 1 : 0.5,
      }}
      src={url}
      onClick={() => window.open(url, '_blank')}
    />
  )
}