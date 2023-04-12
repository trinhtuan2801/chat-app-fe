import { Box, Paper, Typography } from "@mui/material"
import { useCallback, useRef } from "react"
import { useContext } from "react"
import { useEffect } from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import { BASE_API, SECTION_BORDER_COLOR } from "../../../constants"
import { axiosGet } from "../../../utils/axiosUtils"
import { WebsocketContext } from "../../../WebsocketContext/WebsocketContext"
import InputBox from "./InputBox"
import Message from "./Message"
import PinnedMessageBox from "./PinnedMessageBox"
import TitleBox from "./TitleBox"

const limit = 20

const ChatBox = () => {

  const { conversation_id, my_id } = useSelector(state => state.friendList)

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [ended, setEnded] = useState(false)
  const socket = useContext(WebsocketContext)
  const boxRef = useRef()
  const [offset, setOffset] = useState(0)
  const [observerTrigger, setObserverTrigger] = useState(false)
  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting) {
          console.log('visible')
          setObserverTrigger(prev => !prev)
        }
      }
    ))
  const [oldestMessage, setOldestMessage] = useState(null)

  useEffect(() => {
    console.log('loading', loading, ended)
    if (loading || ended) return
    let timer = setTimeout(() => setOffset(messages.length), 100)
    return () => clearTimeout(timer)
  }, [observerTrigger])

  const getMessages = async (firstTime = false) => {
    setLoading(true)
    const response = await axiosGet(`${BASE_API}/conversations/${conversation_id}/messages`, {
      offset: firstTime ? 0 : offset,
      limit: limit - 1
    }, true)
    setTimeout(() => setLoading(false), 100)
    // setLoading(false)

    if (response.success) {
      const messages = response.data
      console.log('new messages', messages)
      if (messages.length === 0) {
        setEnded(true)
        console.log('ENDED')
        return
      }
      setMessages(prev => [...messages, ...prev])
      if (offset === 0) {
        console.log('scroll')
        boxRef.current.scroll({
          top: boxRef.current.scrollHeight,
        })
      }
    } else {
      setEnded(true)
    }
  }

  useEffect(() => {
    const currentElement = oldestMessage;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [oldestMessage]);

  useEffect(() => {
    setMessages([])
    setEnded(false)
    setOffset(0)
    if (conversation_id) {
      getMessages(true)
    }
  }, [conversation_id])

  useEffect(() => {
    console.log(offset)
    if (offset > 0)
      getMessages()
  }, [offset])

  useEffect(() => {
    socket.on('onMessage', (response) => {
      const new_message = response.data
      if (new_message.conversation_id === conversation_id) {
        setMessages(prev => [...prev, new_message])
      }
      if (new_message.user_id === my_id) {
        boxRef.current.scroll({
          top: boxRef.current.scrollHeight,
          behavior: 'smooth'
        })
      }
    })

    return () => {
      socket.off('onMessage')
    }
  }, [messages])

  return (
    <Box
      flexGrow={1}
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
    // paddingTop={1}
    >
      {conversation_id ?
        <>
          <TitleBox />
          <PinnedMessageBox />
          <Box
            ref={boxRef}
            flexGrow={1}
            display='flex'
            flexDirection='column'
            sx={{ overflowY: 'scroll' }}
            rowGap={1.5}
            paddingY={1.5}
            marginTop={0.3}
            className='custom-scroll-bar'
          >
            <Box width='100%' display='flex' justifyContent='center'>
              <Typography variant="caption" color='GrayText'>Đã đọc hết</Typography>
            </Box>
            {messages.map((message, index) => (
              <Message
                key={message.id}
                oldestMessageRef={index === 2 ? setOldestMessage : null}
                _data={message}
              />
            ))}
          </Box>
          <InputBox />
        </>
        :
        <Box display='flex' alignItems='center' justifyContent='center' flexGrow={1}>
          <Typography>Bạn chưa có liên hệ nào :(</Typography>
        </Box>
      }

    </Box>
  )
}

export default ChatBox