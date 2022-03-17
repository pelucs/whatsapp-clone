import './App.css';
import { BrowserRouter } from 'react-router-dom';

import Rotas from './Rotas.js';

export default () => {
  return(
    <div>
      <BrowserRouter>
        <Rotas/>
      </BrowserRouter>
    </div>
  );
}