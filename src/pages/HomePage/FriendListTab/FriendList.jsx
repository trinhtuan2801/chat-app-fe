import { Box } from "@mui/material"
import { useContext } from "react"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { BASE_API } from "../../../constants"
import { setChatTitle, setConversationId } from "../../../redux/friendListReducer"
import { axiosGet } from "../../../utils/axiosUtils"
import { getSocketHeaders, WebsocketContext } from "../../../WebsocketContext/WebsocketContext"
import Conversation from "./Conversation"

const FriendList = () => {
  const { refresh_list, conversation_id } = useSelector(state => state.friendList)
  const [list, setList] = useState([])
  const socket = useContext(WebsocketContext)
  const dispatch = useDispatch()
  const getList = async () => {
    const response = await axiosGet(`${BASE_API}/user-conversation`, {
      offset: 0,
      limit: 20
    }, true)
    console.log('user conversations', response)
    if (response.success) {
      const ucs = response.data
      setList(ucs)
      if (ucs.length > 0) {
        let str_list = ucs.map(({ conversation_id }) => conversation_id.toString())
        socket.emit('joinRoom', {
          conversation_ids: str_list,
          headers: getSocketHeaders()
        })
        console.log('conv', conversation_id)
        if (!conversation_id) {
          const uc = ucs[0]
          dispatch(setConversationId(uc.conversation_id))
          dispatch(setChatTitle(uc.title))
        }
      }
    }
  }

  useEffect(() => {
    getList()
  }, [refresh_list])

  useEffect(() => {
    socket.on('onRefreshFriendList', () => {
      getList()
    })
    return () => {
      socket.off('onRefreshFriendList')
    }
  }, [list, conversation_id])

  return (
    <>
      <Box
        width='100%'
        height='calc(100% - 64px)'
        sx={{ overflowY: 'scroll' }}
        marginTop={2}
        paddingX={1}
        className='custom-scroll-bar'
      >
        {list.map((item, index) => (
          <Conversation
            key={item.id}
            latest_message={item.latest_message}
            title={item.title}
            updatedAt={item.updatedAt}
            id={item.conversation_id}
          />
        ))}
      </Box>
    </>
  )
}

export default FriendList