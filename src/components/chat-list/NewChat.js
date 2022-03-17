import './NewChat.css';
import { useState, useEffect } from 'react';
import Api from '../../Firebase';

import avatar from '../../media/user.jpg';

export default ({ user, chatlist, show, setShow }) => {
  
  const [list, setList] = useState([]);

  useEffect(() => {
    const getList = async () => {
      if(user !== null){
        let results = await Api.getContactList(user.id);

        setList(results);
      }
    }
    getList();
  }, [user]);
  
  const addNewChat = async user2 => {
    await Api.addNewChat(user, user2);

    closeNewChat();
  }

  const closeNewChat = () => {
    setShow(false);
  }

  return(
    <div className="new-chat" style={{ left: show ? 0 : -415 }}>
      <div className="new-chat-header">
        <span onClick={closeNewChat}>
          <ion-icon name="arrow-back-outline"></ion-icon>
        </span>
        <h1>Nova conversa</h1>
      </div>
      <div className="new-chat-list">
        {
          list.map((item, key) => (
            <div onClick={() => addNewChat(item)} key={key} className="new-chat-user">
              <img src={item.avatar} alt="Profile"/>
              <h1>{item.name}</h1>
            </div>
          ))
        }
      </div>
    </div>
  );
}