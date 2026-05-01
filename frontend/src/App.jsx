import { Routes, Route } from "react-router-dom";
import AppLayout from "./shared/app/layout/AppLayout.jsx";
import HomePage from "./feature/home/pages/HomePage.jsx";
import NewsPage from "./feature/News/pages/NewsPage.jsx";

function App() {

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/news" element={<NewsPage />}/>
      </Route>
    </Routes>
  );
}

export default App;
