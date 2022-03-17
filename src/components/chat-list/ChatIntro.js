import './ChatIntro.css';

import intro from '../../media/intro-wpp.jpg';

export default () => {
  return(
    <div className="chat-intro-container">
      <img src={intro} alt="Intro"/>
      <h1>Mantenha seu celular conectado</h1>
      <h2>O WhatsApp conecta ao celular para sincronizar suas mensagens. <br></br>
      Para reduzir o uso de dados, conecte seu telefone a uma rede Wi-fi.</h2>
    </div>
  );
}