import React, { useContext ,useEffect , useState} from "react";
import { Grid, Typography, Paper, makeStyles } from "@material-ui/core";

import { SocketContext } from "../SocketContext";

const useStyles = makeStyles((theme) => ({
  video: {
    width: "550px",
    [theme.breakpoints.down("xs")]: {
      width: "300px",
    },
    transform: "rotateY(180deg)",
  },
  gridContainer: {
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  paper: {
    padding: "10px",
    border: "2px solid black",
    margin: "10px",
  },
  videoRotate: {
    transform: "rotateY(180deg)",
  },
}));

const VideoPlayer = () => {
  const {
    list,
    name,
    callAccepted,
    myVideo,
    userVideo,
    callEnded,
    stream,
    call,
    muted,
  } = useContext(SocketContext);
  const classes = useStyles();

  console.log("list:", list.current);
  console.log("userVideo:", list.userVideo);
 
  return (
    <Grid container className={classes.gridContainer}>
    
      {/* { list.current.map((item) => ( <div key={item.id}> {item} 1</div>))} */}
      {stream && (
        <Paper className={classes.paper}>
          {name}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {name || "Name"}
            </Typography>
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className={classes.video}
            />
          </Grid>
          <div onClick={muted}> mute </div>
        </Paper>
      )}
      {callAccepted && !callEnded && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {call.name || "Name"}
            </Typography>
            <video
              playsInline
              ref={userVideo}
              autoPlay
              className={classes.video}
            />
          </Grid>
        </Paper>
      )}

    </Grid>
  );
};

export default VideoPlayer;
