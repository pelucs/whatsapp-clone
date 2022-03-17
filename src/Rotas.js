import { Routes, Route } from 'react-router-dom';

import App from './rotas/app/App';

export default () => {
  return(
    <Routes>
      <Route path="/" element={<App/>}/>
    </Routes>
  );
}