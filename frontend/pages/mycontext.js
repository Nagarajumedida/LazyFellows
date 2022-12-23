import { createContext, useEffect, useRef, useState } from "react";
import {} from "socket.io-client"
import Peer from "simple-peer"

const Socketcontext=createContext();

const socket=io("http://localhost:7500");

const ContextProvider=({children})=>{
    const [call,setCall]=useState({});
    const [accepted,setAccepted]=useState(false);
    const [ended,setEnded]=useState(false);
    const [streaming,setStreaming]=useState();
    const [name,setName]=useState('');
    const [me,setMe]=useState("");

    const selfvideo=useRef();
    const uservideo=useRef();
    const connectioncheck=useRef();

    useEffect(()=>{
        navigator.mediaDevices.getUserMedia({video:true,audio:true})
        .then((current)=>{
            setStreaming(current)
            selfvideo.current.srcObject=current
        });

        socket.on("me",(id)=>setMe(id));
        socket.on("callUser",({from,name:callerName,signal})=>{
            setCall({callRecieved:true,from,name:callerName,signal
            });
        })
    },[])

    const pickCall=()=>{
        setAccepted(true);

        const peer=new Peer({initiator:false,trickle:false,streaming});

        peer.on("signal",(data)=>{
            socket.emit("answercall",{signal:data,to:call.from})
        });

        peer.on("streaming",(current)=>{
            uservideo.current.srcObject=current;
        })

        peer.signal(call.signal);

        connectioncheck.current=peer;
    };

    const callinguser=(id)=>{
        const peer=new Peer({initiator:true,trickle:false,streaming});

        peer.on("signal",(data)=>{
            socket.emit("callinguser",{usertocall:id,signaldata:data,from:me,name})
        })

        peer.on("streaming",(current)=>{
            uservideo.current.srcObject=current;
        })

        socket.on("callrevieved",(signal)=>{
            setAccepted(true)
            peer.signal(signal)
        })

        connectioncheck.current=peer;
    };

    const dropcall=()=>{
        setEnded(true);
        connectioncheck.current.destroy();
        window.location.reload();
    };

    return(
        <Socketcontext.Provider value={{call,accepted,ended,streaming,me,selfvideo,uservideo,name,setName,pickCall,dropcall,callinguser}}>{children}</Socketcontext.Provider>
    )
};

export {ContextProvider,Socketcontext}