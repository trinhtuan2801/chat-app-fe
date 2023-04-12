import { Clear } from "@mui/icons-material"
import { Box, Button, Dialog, Divider, IconButton, TextField, Typography } from "@mui/material"
import { useSnackbar } from "notistack"
import { useState } from "react"
import { useSelector } from "react-redux"
import { BASE_API } from "../../../constants"
import { axiosGet, axiosPost } from "../../../utils/axiosUtils"

const AddPeopleDialog = ({ open, onClose }) => {

  const [phones, setPhones] = useState('')
  const { enqueueSnackbar } = useSnackbar()
  const { conversation_id } = useSelector(state => state.friendList)

  const submit = async () => {
    const response = await axiosPost(`${BASE_API}/user-conversation/add-many/${conversation_id}`, {
      array_user_phone: phones.split('\n').map(str => str.trim()).filter(val => val)
    }, true)
    if (response.success) {
      enqueueSnackbar('Thêm thành công', { variant: 'success' })
      setPhones('')
      onClose()
    } else {
      enqueueSnackbar(response.message || 'Có lỗi', { variant: 'error' })
    }
    console.log(response)
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <Box width='350px'>
        <Box display='flex' justifyContent='space-between' padding={1} paddingX={2}>
          <Typography variant='h6'>
            Thêm thành viên
          </Typography>
          <IconButton onClick={onClose} size='small'>
            <Clear fontSize="inherit" />
          </IconButton>
        </Box>
        <Divider />
        <Box padding={2}>
          <TextField
            name='phone'
            label='Danh sách số điện thoại'
            fullWidth
            multiline
            minRows={5}
            maxRows={5}
            size='small'
            type='number'
            placeholder="Xuống dòng để thêm"
            value={phones}
            onChange={e => setPhones(e.target.value)}
          />
          <Box marginTop={2} />
          <Button
            fullWidth
            variant="contained"
            onClick={submit}
            disabled={!phones}
          >Thêm</Button>
        </Box>
      </Box>
    </Dialog>
  )
}

export default AddPeopleDialog