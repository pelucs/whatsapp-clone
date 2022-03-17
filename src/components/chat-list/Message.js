import './Message.css';
import { useState, useEffect } from 'react';

export default ({ data, user }) => {

  const [time, setTime] = useState();

  useEffect(() => {
    if(data.date > 0){
      let date = new Date(data.date.seconds * 1000),
          hours = date.getHours(),
          minutes = date.getMinutes();

      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;

      setTime(`${hours}:${minutes}`);
    }
  }, [time]);

  return(
    <div 
      className="message-line"
      style={{ justifyContent: user.id == data.author ? "flex-end" : "flex-start" }}
    >
      <div 
        className="message-box"
        style={{ backgroundColor: user.id == data.author ? "#DCF8C6" : "#fff" }}
      >
        <p>{data.body}</p>
        <span>{time}</span>
      </div>
    </div>
  );
}