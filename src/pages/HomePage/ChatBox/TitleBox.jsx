import { Add, BorderBottom, GroupAdd } from "@mui/icons-material"
import { Button, Dialog, IconButton, Paper, Typography } from "@mui/material"
import { useEffect } from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import { BASE_API, SECTION_BORDER_COLOR } from "../../../constants"
import { axiosGet } from "../../../utils/axiosUtils"
import AddPeopleDialog from "./AddPeopleDialog"

const TitleBox = () => {

  const { chat_title, conversation_id, my_id } = useSelector(state => state.friendList)
  const [conversationInfo, setConversationInfo] = useState(null)
  const [openAddPeople, setOpenAddPeople] = useState(false)

  const getConversationInfo = async () => {
    const response = await axiosGet(`${BASE_API}/conversations/${conversation_id}`, null, true)
    if (response.success) {
      setConversationInfo(response.data)
    }
  }

  useEffect(() => {
    getConversationInfo()
  }, [conversation_id])

  const imOwner = conversationInfo?.author_id === my_id && conversationInfo?.type === 'GROUP'

  return (
    <Paper
      sx={{
        minHeight: '64px',
        display: 'flex',
        alignItems: 'center',
        paddingX: 2,
        justifyContent: 'space-between',
        borderBottom: `1px solid ${SECTION_BORDER_COLOR}`
      }}
      square
    >
      <Typography fontWeight={600}>{chat_title}</Typography>
      {imOwner &&
        <Button
          size='small'
          startIcon={<GroupAdd />}
          variant='outlined'
          onClick={() => setOpenAddPeople(true)}
        >Thêm</Button>
      }
      <AddPeopleDialog open={openAddPeople} onClose={() => setOpenAddPeople(false)} />
    </Paper>
  )
}

export default TitleBox

