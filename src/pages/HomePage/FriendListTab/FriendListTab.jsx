import { Box, Typography } from "@mui/material"
import { useEffect } from "react"
import { useState } from "react"
import AddFriendBox from "./AddFriendBox/AddFriendBox"
import { BASE_API, SECTION_BORDER_COLOR } from '../../../constants'
import { useSelector } from "react-redux"
import { axiosGet } from "../../../utils/axiosUtils"
import FriendList from "./FriendList"
const FriendListTab = () => {

  return (
    <Box
      width='300px'
      minWidth='300px'
      height='100%'
      borderRight={`1px solid ${SECTION_BORDER_COLOR}`}
      paddingTop={2}
    >
      <AddFriendBox />
      <FriendList />
    </Box>
  )
}

export default FriendListTab