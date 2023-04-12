import { Clear } from "@mui/icons-material"
import { Button, Dialog, DialogContent, DialogTitle, Divider, IconButton, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useSnackbar } from "notistack"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { BASE_API } from "../../../../constants"
import { refreshFriendList } from "../../../../redux/friendListReducer"
import { axiosPost } from '../../../../utils/axiosUtils'

const AddGroupDialog = ({ open, onClose }) => {

  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const { enqueueSnackbar } = useSnackbar()

  const addGroup = async () => {
    const response = await axiosPost(`${BASE_API}/conversations/group-chat`, {
      title,
      description
    }, true)
    if (response.success) {
      enqueueSnackbar('Tạo nhóm thành công :D', { variant: 'success' })
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
            Tạo nhóm
          </Typography>
          <IconButton onClick={onClose} size='small'>
            <Clear fontSize="inherit" />
          </IconButton>
        </Box>
        <Divider />
        <Box padding={2}>
          <TextField
            label='Tên nhóm'
            fullWidth
            size='small'
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <Box marginTop={2} />
          <TextField
            label='Mô tả'
            fullWidth
            size='small'
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <Box marginTop={2} />
          <Button
            fullWidth
            variant="contained"
            onClick={addGroup}
            disabled={!title}
          >Tạo</Button>
        </Box>
      </Box>
    </Dialog>
  )
}
export default AddGroupDialog