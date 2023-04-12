import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from 'react-router-dom'
import { SnackbarProvider, useSnackbar } from "notistack";
import { IconButton } from "@mui/material";
import { Clear } from '@mui/icons-material'
import { socket, WebsocketProvider } from "./WebsocketContext/WebsocketContext";
import { Provider } from 'react-redux'
import store from "./redux/store";

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        action={id => {
          const { closeSnackbar } = useSnackbar()
          return (
            <IconButton size='small' onClick={() => closeSnackbar(id)}>
              <Clear />
            </IconButton>
          )
        }}
      >
        <WebsocketProvider value={socket}>
          <App />
        </WebsocketProvider>
      </SnackbarProvider>
    </Provider>
  </BrowserRouter>
  , document.getElementById('root'))