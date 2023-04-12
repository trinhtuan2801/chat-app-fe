import { Box, Button, Divider, Paper, TextField, Typography, useTheme } from "@mui/material"
import { axiosPost } from '../../../utils/axiosUtils'
import { BASE_API } from '../../../constants'
import { useSnackbar } from 'notistack'
const RegisterBox = () => {
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()

  const submit = async (e) => {
    e.preventDefault()
    const elements = e.target.elements
    const name = elements['name'].value
    const email = elements['email'].value
    const phone = elements['phone'].value
    const password = elements['password'].value

    let response = await axiosPost(`${BASE_API}/auth/register`, {
      name,
      email,
      phone,
      password
    })
    console.log('response', response)
    if (!response.success) {
      enqueueSnackbar(response?.message || 'Sum ting wong', { variant: 'error' })
    } else {
      enqueueSnackbar('Nice, now login', { variant: 'success' })
    }
  }

  return (
    <Paper
      style={{ padding: theme.spacing(2), display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      elevation={3}
    >
      <Typography variant='h6'>Register</Typography>
      <Divider flexItem orientation="horizontal" style={{ marginTop: theme.spacing(1.5), marginBottom: theme.spacing(1.5) }} />
      <form onSubmit={submit}>
        <Box marginTop={1.5} />
        <TextField
          name="name"
          variant="outlined"
          size="small"
          required
          label='name'
          fullWidth
        />
        <Box marginTop={2.5} />
        <TextField
          name="email"
          variant="outlined"
          size="small"
          required
          label='email'
        />
        <Box marginTop={2.5} />
        <TextField
          name="phone"
          variant="outlined"
          size="small"
          required
          label='phone'
        />
        <Box marginTop={2.5} />
        <TextField
          name="password"
          variant="outlined"
          size="small"
          required
          label='password'
          type='password'
        />
        <Box marginTop={2.5} />
        <Button
          fullWidth
          variant='contained'
          type='submit'
        >Create Account</Button>
      </form>

    </Paper>
  )
}

export default RegisterBox