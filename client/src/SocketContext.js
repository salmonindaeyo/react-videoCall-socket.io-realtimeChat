import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

// const socket = io('http://localhost:5000');
const socket = io(process.env.base_url_api,
{
    extraHeaders: {
        'ngrok-skip-browser-warning': true,
      } 
});

console.log(process.env.base_url_api)
const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState('unknown user');
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');
  const [chatList, setChatList] = useState([]);
  const [text, setText] = useState('');
  const [userList, setUserList] = useState([]);
  // const [list, setList] = useState([]);

  const list = useRef([]);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    console.log(list); // แสดงค่าใหม่ที่ถูกเซ็ตใน state
  }, [list]);


  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        console.log(currentStream)
        setStream(currentStream);
        if (myVideo.current) {
        myVideo.current.srcObject = currentStream;
        console.log(myVideo.current.muted + 'xxx')
        
    }
      });

    socket.on('me', (id) => setMe(id));

    socket.on('callUser', ({ from, name: callerName, signal }) => {
  
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);

  const sendMessage = (text) => {
    // socket.emit('chatter', name + ' : ' +text);    
    socket.emit('notice', name + ' : ' +text);    

socket.on('chatter', (mess) => {
console.log(mess + ' this is socket . on')
setChatList([...chatList,{text:mess,id:chatList.length+1}] )
setText('')
});

}

  const muted = () => {
    if (myVideo.current) {
      setIsMuted(!isMuted)  
      myVideo.current.muted = isMuted;
      console.log(isMuted)
    }
  }

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
        if (userVideo.current) { 
          userVideo.current.srcObject = currentStream;
    }});

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });

    peer.on('stream', (currentStream) => {
        if (userVideo.current) {  
      userVideo.current.srcObject = currentStream;
    }
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
      muted,
      chatList,
      setText,
      setChatList,
      text,
      sendMessage,
      userList,
      list
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };