import { ExpandLess, ExpandMore, PushPin } from "@mui/icons-material"
import { Box, Button, Collapse, IconButton, Paper, Typography } from "@mui/material"
import { useContext } from "react"
import { useState } from "react"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { BASE_API, FILE_TYPE, textEllipsis } from "../../../constants"
import { axiosGet } from "../../../utils/axiosUtils"
import { getSocketHeaders, WebsocketContext } from "../../../WebsocketContext/WebsocketContext"
import { FileMessage } from "./InputBox"
import { ImageMessage } from "./Message"

const PinnedMessageBox = () => {

  const { conversation_id } = useSelector(state => state.friendList)
  const socket = useContext(WebsocketContext)
  const [pinnedMessage, setPinnedMessage] = useState(null)
  const [expand, setExpand] = useState(false)

  const getPinnedMessage = async () => {
    const response = await axiosGet(`${BASE_API}/conversations/${conversation_id}/pinned-message`, null, true)
    if (response.success) {
      setPinnedMessage(response.data)
      console.log('pinned', response.data)
    }
  }

  const unpin = () => {
    socket.emit('pinMessage', {
      conversation_id,
      message_id: null,
      headers: getSocketHeaders()
    })
  }

  useEffect(() => {
    setExpand(false)

    socket.on('onPinMessage', response => {
      console.log(response.data)
      setPinnedMessage(response.data.pinned_message)
    })

    if (conversation_id)
      getPinnedMessage()

    return () => socket.off('onPinMessage')
  }, [conversation_id])

  const file = pinnedMessage?.file
  const file_type = file?.type

  return (
    <>
      {pinnedMessage &&
        <Paper
          sx={{
            // minHeight: '64px',
            paddingX: 2,
            paddingY: 2,
          }}
          square
        >
          <Box display='flex' justifyContent='space-between'>
            <Typography variant='body2' sx={{
              display: 'flex',
              alignItems: 'center'
            }}>
              <PushPin color="info" fontSize="inherit" />&nbsp;
              Pinned Message
            </Typography>
            <Button
              size='small'
              color='secondary'
              onClick={unpin}
            >Unpin</Button>
          </Box>
          <Box
            display='flex'
            justifyContent='space-between'
          >
            <Collapse
              in={expand}
              collapsedSize='20px'
              style={{ flexGrow: 1, marginTop: '5px' }}
            >
              {!!file ?
                <>
                  {file_type === FILE_TYPE.IMAGE ?
                    <ImageMessage url={file.url} />
                    :
                    <FileMessage name={file.name} url={file.url} />
                  }
                </>
                :
                <Typography sx={{
                  whiteSpace: 'pre-wrap',
                  ...textEllipsis(expand ? 'none' : 1)
                }}>

                  {pinnedMessage.message}
                </Typography>
              }

            </Collapse>
            <IconButton
              onClick={() => setExpand(prev => !prev)}
              size='small'
              sx={{ height: 'fit-content', width: 'fit-content', marginLeft: 2 }}
            >
              {expand ?
                <ExpandLess />
                :
                <ExpandMore />
              }
            </IconButton>
          </Box>
        </Paper>
      }
    </>
  )
}

export default PinnedMessageBox