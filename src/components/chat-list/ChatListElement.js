import './ChatListElement.css';
import { useState, useEffect } from 'react';

import profile from '../../media/user.jpg';

export default ({ onclick, active, data }) => {

  const [time, setTime] = useState();

  useEffect(() => {
    if(data.lastMessageDate > 0){
      let date = new Date(data.lastMessageDate.seconds * 1000),
          hours = date.getHours(),
          minutes = date.getMinutes();

      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;

      setTime(`${hours}:${minutes}`);
    }
  }, [time]);

  return(
    <div onClick={onclick} className={`chat-element-container ${active ? 'active' : ''}`}>
      <img src={data.image} alt="Profile"/>
      <div className="chat-lines">
        <div className="chat-line">
          <h1>{data.title}</h1>
          <h2>{time}</h2>
        </div>
        <div className="chat-line">
          <div className="chat-last-msg">
            <p>{data.lastMessage}</p>
          </div>
        </div>
      </div>
    </div>
  );
}