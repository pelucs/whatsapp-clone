import './Chat.css';
import React, { useState, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import Message from './Message';
import Api from '../../Firebase';

import user from '../../media/user.jpg';

export default ({ user, data }) => {

  const body = useRef();
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [list, setList] = useState([]);
  const [users, setUsers] = useState([]);

  //MONITORAR MENSAGENS NO CHAT
  useEffect(() => {
    setList([]);
    let unsub = Api.onChatContent(data.chatId, setList, setUsers);

    return unsub;
  }, [data.chatId]);

  //JOGAR O CHAT PARA BAIXO
  useEffect(() => {
    if(body.current.scrollHeight > body.current.offsetHeight){
      body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight;
    }
  }, [list]);

  //EMOJIS
  const handleEmojiClick = (e, emojiObject) => {
    setText(text + emojiObject.emoji);
  }
  const handleOpenEmoji = () => {
    setEmojiOpen(true);
  }
  const handleCloseEmoji = () => {
    setEmojiOpen(false);
  }

  //ENVIO DE MENSAGEM
  const handlInputKeyUp = e => {
    if(e.keyCode == 13){
      handleSendMsg();
    }
  }

  const handleSendMsg = () => {
    if(text !== ""){
      Api.sendMessage(data, user.id, "text", text, users);
      setText("");
      setEmojiOpen(false);
    }
  }

  //GRAVAR ÁUDIO
  let recognition,
      SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if(SpeechRecognition !== undefined){
    recognition = new SpeechRecognition();
  }

  const handleMicClick = () => {
    if(recognition !== null){
      recognition.onstart = () => {
        setListening(true);
      }
      recognition.onend = () => {
        setListening(false);
      }
      recognition.onresult = (e) => {
        console.log(e)
        setText(e.results[0][0].transcript);
      }

      recognition.start();
    }
  }

  return(
    <div className="chat-container">
      <div className="header-chat">
        <div className="chat-header-info">
          <img src={data.image} alt="Profile"/>
          <h1>{data.title}</h1>
        </div>
        <ul className="chat-header-buttons chat-icons">
          <li><ion-icon name="search"></ion-icon></li>
          <li><ion-icon name="attach"></ion-icon></li>
          <li><ion-icon name="ellipsis-vertical"></ion-icon></li>
        </ul>
      </div>
      <div ref={body} className="body-chat">
        {
          list.map((item, key) => (
            <Message
              key={key} 
              data={item}
              user={user}
            />
          ))
        }
      </div>
      <div className="chat-emoji-area" 
        style={{ height: emojiOpen ? "250px" : "0px" }}
        >
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          preload
          native
          disableSearchBar
          disableSkinTonePicker
        />
      </div>
      <div className="footer-chat">
        <ul className="chat-icons chat-icons-left">
          <li 
            style={{ width: emojiOpen ? "40px" : "0"}}
            onClick={handleCloseEmoji}
          >
              <ion-icon name="close"></ion-icon>
          </li>
          <li
            onClick={handleOpenEmoji}
            style={{ color: emojiOpen ? "var(--primaria)" : "#919191" }}
          >
            <ion-icon name="happy-outline"></ion-icon>
          </li>
        </ul>
        <div className="chat-input">
          <input
            type="text" 
            placeholder="Digite uma mensagem..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyUp={handlInputKeyUp}
          />
        </div>
        <ul className="chat-icons chat-icons-right">
          <li
            onClick={handleSendMsg}
            style={{ display: text ? "flex" : "none"}}
          >
            <ion-icon name="send"></ion-icon>
          </li>
          <li
            onClick={handleMicClick}
            style={{display: text ? "none" : "flex", color: listening === true ? "var(--primaria)" : "#919191"}}
          >
            <ion-icon name="mic"></ion-icon>
          </li>
        </ul>
      </div>
    </div>
  );
}