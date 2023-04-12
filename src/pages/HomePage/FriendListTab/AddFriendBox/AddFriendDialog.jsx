import { Clear } from "@mui/icons-material"
import { Button, Dialog, DialogContent, DialogTitle, Divider, IconButton, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useSnackbar } from "notistack"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { BASE_API } from "../../../../constants"
import { refreshFriendList } from "../../../../redux/friendListReducer"
import { axiosPost } from '../../../../utils/axiosUtils'

const AddFriendDialog = ({ open, onClose }) => {

  const dispatch = useDispatch()
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const { enqueueSnackbar } = useSnackbar()

  const addFriend = async () => {
    const response = await axiosPost(`${BASE_API}/conversations/friend-chat`, {
      friend_phone: phone,
      message: message || 'Hello'
    }, true)
    if (response.success) {
      enqueueSnackbar('Thêm liên hệ thành công :D', { variant: 'success' })
      dispatch(refreshFriendList())
      onClose()
    } else {
      enqueueSnackbar(response.message || 'Lỗi', { variant: 'error' })

    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <Box width='350px'>
        <Box display='flex' justifyContent='space-between' padding={1} paddingX={2}>
          <Typography variant='h6'>
            Thêm liên hệ
          </Typography>
          <IconButton onClick={onClose} size='small'>
            <Clear fontSize="inherit" />
          </IconButton>
        </Box>
        <Divider />
        <Box padding={2}>
          <TextField
            name='phone'
            label='Số điện thoại'
            fullWidth
            size='small'
            type='number'
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          <Box marginTop={2} />
          <TextField
            name='message'
            label='Lời chào'
            placeholder='hello'
            fullWidth
            size='small'
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <Box marginTop={2} />
          <Button
            fullWidth
            variant="contained"
            onClick={addFriend}
            disabled={!phone}
          >Gửi</Button>
        </Box>
      </Box>
    </Dialog>
  )
}
export default AddFriendDialog