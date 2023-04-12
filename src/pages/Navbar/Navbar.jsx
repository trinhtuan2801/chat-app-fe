import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { Login, Logout, SentimentVerySatisfied } from '@mui/icons-material'
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux'
import { BASE_API, SECTION_BORDER_COLOR } from "../../constants"
import { useState } from "react"
import { axiosGet } from "../../utils/axiosUtils"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setMyId } from "../../redux/friendListReducer"
const Navbar = () => {
  const navigate = useNavigate()
  const { signed_in, refresh_navbar } = useSelector(state => state.root)
  const dispatch = useDispatch()
  const [userData, setUserData] = useState(null)

  const getUserData = async () => {
    const response = await axiosGet(`${BASE_API}/users`, null, true)
    if (response.success) {
      setUserData(response.data)
      dispatch(setMyId(response.data.id))
    }
  }

  useEffect(() => {
    getUserData()
  }, [refresh_navbar])

  const logout = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <AppBar
      elevation={1}
      sx={{
        backgroundColor: 'white',
        color: 'black',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingX: '16px !important',
        }}
      >
        <Typography
          component='div'
          variant='h6'
          color='primary'
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >Chat App &nbsp;<SentimentVerySatisfied /></Typography>

        {signed_in ?
          <Box display='flex' alignItems='center'>
            <Typography variant="h6" color='primary'>{userData?.name}</Typography>
            <Box marginLeft={2} />
            <IconButton onClick={logout} size='small' color='error'>
              <Logout fontSize="small" />
            </IconButton>
          </Box>

          :
          <Link to='/login'>
            <Typography
              style={{ fontWeight: '500', color: 'white' }}
            >
              Login
            </Typography>
          </Link>
        }

      </Toolbar>
    </AppBar>
  )
}

export default Navbar

