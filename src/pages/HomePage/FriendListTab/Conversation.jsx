import { Box, Typography } from "@mui/material"
import { FILE_TYPE, textEllipsis } from "../../../constants"
import moment from 'moment'
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { setChatTitle, setConversationId } from "../../../redux/friendListReducer"
import { useEffect } from "react"

const Conversation = ({
  title,
  latest_message,
  updatedAt,
  id,
}) => {

  const { conversation_id } = useSelector(state => state.friendList)
  const dispatch = useDispatch()

  const onClick = () => {
    dispatch(setConversationId(id))
    dispatch(setChatTitle(title))
  }

  let chosen = conversation_id === id

  const time = latest_message?.updatedAt || updatedAt

  const file_type = latest_message?.file?.type

  const file_type_str = file_type === FILE_TYPE.IMAGE ? '<Ảnh>' : '<File>'

  return (
    <>
      <Box
        paddingX={2}
        paddingY={1}
        sx={{
          cursor: 'pointer',
          backgroundColor: chosen ? '#EAF3FF' : 'transparent',
          borderRadius: '4px'
        }}
        onClick={onClick}
      >
        <Typography >{title}</Typography>
        <Box display='flex' justifyContent='space-between'>
          <Typography
            variant="caption"
            color='GrayText'
            sx={{
              width: 'calc(100% - 150px)',
              ...textEllipsis(1),
              whiteSpace: 'pre-wrap'
            }}
          >
            {!!latest_message.file ?
              <>
                {file_type_str}
              </>
              :
              <>
                {latest_message?.message}
              </>
            }
          </Typography>
          <Typography
            variant="caption"
            color='GrayText'
          >
            {moment(time).format('DD/MM - HH:mm')}
          </Typography>
        </Box>
      </Box>
    </>
  )
}

export default Conversation