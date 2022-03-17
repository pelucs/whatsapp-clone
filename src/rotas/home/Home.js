import './Home.css';
import { useState } from 'react';
import Api from '../../Firebase';

import logo from '../../media/whatsapp.svg';
import ilust from '../../media/ilustration.png';

export default ({ onReceive }) => {

  const [aviso, setAviso] = useState(true);

  //LOGIN COM O GOOGLE
  const loginGoogle = async () => {
    let result = await Api.popUpGoogle();

    if(result){
      onReceive(result.user);
    } else{
      alert("*Ocorreu um erro");
    }
  }

  //FECHAR AVISO
  const closeAviso = () => {
    setAviso(false);
  }

  return(
    <div className="home">
      <div className="header-home">
        <img src={logo} alt="Logo"/>
        <button onClick={loginGoogle}><ion-icon name="logo-google"></ion-icon>Entrar</button>
      </div>
      <div className="section">
        <div className="content content-left">
          <h1>WhatsApp</h1>
          <p>Conecte-se com seus amigos</p>
          <hr></hr>
        </div>
        <div className="content content-right">
          <img src={ilust} alt="Ilustração"/>
          <div className="circle"></div>
        </div>
      </div>
      <div className="aviso-footer" style={{ display: aviso === true ? "flex" : "none" }}>
        <p>Declaro todos os direitos de images ao Whatsapp. Esta aplicação não possui sistema de responsividade.</p>
        <span onClick={closeAviso}><ion-icon name="close-outline"></ion-icon></span>
      </div>
    </div>
  );
}