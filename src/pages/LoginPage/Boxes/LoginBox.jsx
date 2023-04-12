import { Box, Button, Divider, Paper, TextField, Typography, useTheme } from "@mui/material"
import { axiosPost } from '../../../utils/axiosUtils'
import { BASE_API } from '../../../constants'
import { useSnackbar } from 'notistack'
import { useNavigate } from "react-router-dom"
import { useDispatch } from 'react-redux'
import { setSignedIn, setTokenTimeout } from "../../../redux/rootReducer"
import { setNewTokens } from "../../../App"
import { getDurationFromStr } from "../../../utils/timeUtils"
import { useSelector } from "react-redux"
import { useEffect } from "react"

const LoginBox = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const { signed_in } = useSelector(state => state.root)

  useEffect(() => {
    if (signed_in) navigate('/')
  }, [signed_in])

  const submit = async (e) => {
    e.preventDefault()
    const elements = e.target.elements
    const phone = elements['phone'].value
    const password = elements['password'].value
    let response = await axiosPost(`${BASE_API}/auth/login`, {
      phone,
      password
    })
    console.log('login', response)
    const { access_token, refresh_token, expireIn } = response.data
    setNewTokens(access_token, refresh_token)
    setTimeout(() => {
      dispatch(setTokenTimeout())
      dispatch(setSignedIn(true))
    }, getDurationFromStr(expireIn) / 2)
    if (!response.success) {
      enqueueSnackbar(response?.message || 'Sum ting wong', { variant: 'error' })
    } else {
      enqueueSnackbar('Lets chit chat', { variant: 'success' })
      dispatch(setTokenTimeout())
    }
  }

  return (
    <Paper
      style={{
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
      elevation={3}
    >
      <Typography variant='h6'>Login</Typography>
      <Divider flexItem orientation="horizontal" style={{ marginTop: theme.spacing(1.5), marginBottom: theme.spacing(1.5) }} />
      <form onSubmit={submit} style={{ flexGrow: 1 }}>
        <Box display='flex' flexDirection='column' justifyContent='space-between' height='100%'>
          <Box>
            <Box marginTop={1.5} />
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
          </Box>

          <Box marginTop={2.5}>
            <Button
              fullWidth
              variant='contained'
              type='submit'
              color="secondary"
            >Log in</Button>
          </Box>

        </Box>

      </form>

    </Paper>
  )
}

export default LoginBox