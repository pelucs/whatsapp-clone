import './App.css';
import React, { useState, useEffect } from 'react';
import ChatListElement from '../../components/chat-list/ChatListElement';
import ChatIntro from '../../components/chat-list/ChatIntro';
import Chat from '../../components/chat-list/Chat';
import NewChat from '../../components/chat-list/NewChat';
import Home from '../home/Home';
import Api from '../../Firebase';

export default () => {

  const [chatList, setChatList] = useState([]);
  const [activeChat, setActiveChat] = useState({});
  const [user, setUser] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);

  useEffect(() => {
    if(user !== null){
      let unsub = Api.onChatList(user.id, setChatList);
      return unsub;
    }
  }, [user]);

  const openNewChat = () => {
    setShowNewChat(true);
  }

  const loginData = async user => {
    let newUser = {
      id: user.uid,
      name: user.displayName,
      avatar: user.photoURL
    }
    
    await Api.addUser(newUser);
    setUser(newUser);
  }

  if(user === null){
    return(<Home onReceive={loginData}/>);
  }

  return(
    <div className="app-window">
      <NewChat
        chalist={chatList}
        user={user}
        show={showNewChat}
        setShow={setShowNewChat}
      />
      <div className="sidebar">
        <div className="header">
          <img src={user.avatar} alt="Perfil"/>
          <ul className="header-buttons">
            <li><ion-icon name="aperture-outline"></ion-icon></li>
            <li onClick={openNewChat}><ion-icon name="chatbox-ellipses"></ion-icon></li>
            <li><ion-icon name="ellipsis-vertical"></ion-icon></li>
          </ul>
        </div>
        <div className="search-box">
          <div className="search">
            <ion-icon name="search"></ion-icon>
            <input type="text" placeholder="Procurar ou começar uma nova conversa"/>
          </div>
        </div>
        <div className="chat-list">
          {
            chatList.map((item, key) => (
              <ChatListElement
                key={key}
                data={item}
                active={activeChat.chatId === chatList[key].chatId}
                onclick={() => setActiveChat(chatList[key])}
              />
            ))
          }
        </div>
      </div>
      <div className="content-area">
        {
          activeChat.chatId !== undefined &&
            <Chat
              user={user}
              data={activeChat}
            />
        }
        {
          activeChat.chatId === undefined &&
            <ChatIntro/>
        }
      </div>
    </div>
  );
}
