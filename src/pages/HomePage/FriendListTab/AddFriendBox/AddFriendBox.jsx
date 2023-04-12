import { GroupAdd, PersonAdd } from "@mui/icons-material"
import { Box, Button, ButtonGroup, IconButton, Typography } from "@mui/material"
import { useState } from "react"
import AddFriendDialog from "./AddFriendDialog"
import AddGroupDialog from "./AddGroupDialog"

const AddFriendBox = () => {

  const [openAddFriend, setOpenAddFriend] = useState(false)
  const [openAddGroup, setOpenAddGroup] = useState(false)

  return (
    <Box
      width='100%'
      height='fit-content'
      paddingTop={1}
      display='flex'
      justifyContent='space-between'
      paddingLeft={2}
      paddingRight={1}
    >
      <Typography variant='h5' fontWeight='600'>Chat</Typography>
      <Box display='flex'>
        <IconButton color='primary' onClick={() => setOpenAddFriend(true)}>
          <PersonAdd />
        </IconButton>
        <Box marginLeft={1} />
        <IconButton color='primary' onClick={() => setOpenAddGroup(true)}>
          <GroupAdd />
        </IconButton>
      </Box>

      <AddFriendDialog
        open={openAddFriend}
        onClose={() => setOpenAddFriend(false)}
      />
      <AddGroupDialog
        open={openAddGroup}
        onClose={() => setOpenAddGroup(false)}
      />
    </Box>
  )
}

export default AddFriendBox

