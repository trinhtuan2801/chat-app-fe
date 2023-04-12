import { Box, Button, MenuItem, TextField, Typography, useTheme } from "@mui/material"
import ChatBox from "./ChatBox/ChatBox"
import FriendListTab from "./FriendListTab/FriendListTab"


const HomePage = () => {

  return (
    <Box
      width='100%'
      height='100%'
      paddingTop='64px'
    >
      <Box
        display='flex'
        justifyContent='space-between'
        width='100%'
        height='100%'
      >
        <FriendListTab />
        <ChatBox />
      </Box>
    </Box>
  )
}

export default HomePage