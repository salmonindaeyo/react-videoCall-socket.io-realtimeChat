import React, { createContext, useState, useRef, useEffect ,setText,useContext} from 'react';
import { Button, TextField, Grid, Typography, Container, Paper } from '@material-ui/core';
import { SocketContext } from '../SocketContext';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    width: '600px',   
    height: '200px',
  },
  submit: {
    width: '600px'
  }
}));
const Chat = () => {
  const classes = useStyles();


  const {   chatList,
    setText,
    text,
    sendMessage ,
    name,
    setName
  } = useContext(SocketContext);


    return ( <div >
        <div>   
              <TextField label="ชื่อที่ไว้แสดง" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <div className={classes.root}>
              {
          chatList.map((item) => (
            <div key={item.id}>
              {item.text}
            </div>
          ))}
          </div>

          <input
    className={classes.submit}
    type="text"
    value={text}
    onChange={(e) => setText(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        sendMessage(text);
      }
    }}
  />
            </div>
           

    </div> );
}
 
export default Chat;