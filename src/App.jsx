import { BrowserRouter, Routes, Route } from "react-router-dom";
import ArticleEditor from './components/ArticleEditor';
import './reset.css'
import './index.css'

function App(){

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArticleEditor/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;