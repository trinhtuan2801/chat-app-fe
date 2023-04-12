import { Box, Typography } from "@mui/material"
import LoginBox from "./Boxes/LoginBox"
import RegisterBox from "./Boxes/RegisterBox"

const LoginPage = () => {
  return (
    <Box
      width='100%'
      height='fit-content'
      minHeight='100vh'
      paddingTop='64px'
    >
      <Box
        width='100%'
        display='flex'
        flexDirection='column'
        alignItems='center'
      >
        <Box display='flex' justifyContent='center' marginTop={5}>
          <RegisterBox />
          <Box marginLeft={5} />
          <LoginBox />
        </Box>
      </Box>
    </Box>
  )
}

export default LoginPage
