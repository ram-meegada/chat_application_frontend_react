import { useEffect, useState } from 'react'
import "../css/chatPage.css"
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { decryptKeyBody, generateEncryptedKeyBody } from '../utils';

type UsersType = {
    id: number,
    name: string
  }
type messagesType = {
    userId: string,
    name: string,
    message: string
  }

const ChatPage = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const auth_token = localStorage.getItem('auth_token')
    const [ currentUser, setCurrentUser ] = useState("User")
    const [ currentUserId, setCurrentUserId ] = useState()
    const [ loginUserId, setLoginUserId ] = useState()
    const [ name, setName ] = useState()
    const [ socket, setSocket ] = useState<WebSocket | null>(null)
    const [ users, setUsers ] = useState<UsersType[]>([])
    const [ inputChange, setInputChange ] = useState("")
    const [ messages, setMessages ] = useState<messagesType[]>([])

    useEffect(() => {
        if (location.state) {
            if (location.state.message) {
                toast.success(location.state.message, { autoClose: 2000 })
                navigate(location.pathname, { state: {userId: location.state.userId, name: location.state.name}, replace: true })
            }
            setName(location.state.name)
        }
        const fetchData = async () => {
            const api_hit = await fetch(`http://127.0.0.1:8000/users/`, {
                method: "GET",
                headers: {
                "Authorization": `Bearer ${auth_token}`,
                "Content-Type": "application/json",
                }
            })
            const api_response = await api_hit.json()
            if (api_hit.ok) {
                setUsers(api_response.data)
                setCurrentUser(api_response.data[0]["name"])
                setCurrentUserId(api_response.data[0]["id"])
            }
            else {
                toast.error(api_response.message, { autoClose: 2000 })
            }
            }
        fetchData();    
    }, [])

    useEffect(() => {
        if (typeof(currentUserId) == 'number'){
            
            const fetchData = async () => {
                const api_hit = await fetch(`http://127.0.0.1:8000/history/${currentUserId}/`, {
                    method: "GET",
                    headers: {
                    "Authorization": `Bearer ${auth_token}`,
                    "Content-Type": "application/json",
                    }
                })
                const api_response = await api_hit.json()
                console.log(api_response, '----api_response----api_response----');
                if (api_hit.ok) {
                    const data = api_response.data
                    let da = []
                    for (let i=0; i<data.length; i++){
                        da.push(decryptKeyBody(data[i]["message"]["sek"], data[i]["message"]["hash"]))
                    }
                    setMessages(da)
                }
                else {
                    toast.error(api_response.message, { autoClose: 2000 })
                }
                }
            fetchData();
        }
        }, [currentUserId])

    useEffect(() => {
        const loginUserId = location.state.userId
        setLoginUserId(loginUserId)
        if (currentUserId) {
            const ws = new WebSocket(`ws://127.0.0.1:8000/chat/${loginUserId}/${currentUserId}/`)
            setSocket(ws)
        }
        return () => {
        socket?.close()
    }
    }, [currentUserId])

    useEffect(() => {

        socket?.addEventListener("open", (event) => {
          console.log(event, "Websocket connected successfully");
        })
        socket?.addEventListener("close", (event) => {
          console.log(event, "Websocket closed------");
        })
        socket?.addEventListener("message", (event) => {
          const data = JSON.parse(event.data)
          const da = decryptKeyBody(data.sek, data.hash)
          setMessages(prevMessages => [...prevMessages, da])      
        })
        return () => {
          socket?.close()
        }
      }, [socket])

    function handleSendMessage() {
        const payload = {
            "userId": loginUserId,
            "name": name,
            "message": inputChange
        }
        // const payload = {message: inputChange}
        // console.log(payload, '----payload---');
        
        const encrypted_payload = generateEncryptedKeyBody(payload)
        // const decrypted_payload = decryptKeyBody(encrypted_payload?.sek, encrypted_payload?.hash)
        socket?.send(JSON.stringify(encrypted_payload)) 
        setInputChange("")
    }

    return (
    <>
        <div className="chat-container">
            <div className="sidebar">
            <header className="sidebar-header"><h2>Chats</h2></header>
            <ul className="chat-list">
                {users.map((record, index) => (
                    <li key={index} className="chat-item">{record.name}</li>
                ))}
            </ul>
            </div>
            <div className="main-chat">
            <header className="chat-header"><h2>{currentUser}</h2></header>
            <div className="messages">
            {messages.map((obj, index) => (
                obj.userId == currentUserId ? (
                    <div key={index}>
                        <div className='name'>{obj.name}</div>
                        <div className="message received">{obj.message}</div>
                    </div>
                ) : (
                    <div key={index}>
                        <div className='name'>{obj.name}</div>
                        <div className="message sent">{obj.message}</div>
                    </div>
                )
            ))}
            </div>
            <div className="chat-input">
                <input type="text" id="messageInput" placeholder="Type a message..." value={inputChange} onChange={(e) => setInputChange(e.target.value)} />
                <button onClick={handleSendMessage}>Send</button>
            </div>
            </div>
        </div>
        <ToastContainer />
    </>
  )
}

export default ChatPage;
