// import './App.css';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Login from './login';
// import Dashboard from './dashboard';

// function App() {
//   return (
//     <BrowserRouter>
//       <div className="App">
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;



import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './login';
import Dashboard from './dashboard';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;