import '@xyflow/react/dist/style.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CreateWorkflow } from './components/CreateWorkflow';
import { Auth } from './components/Auth';

export function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth mode="signin" />} />
          <Route path="/signin" element={<Auth mode="signin" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route path="/create" element={<CreateWorkflow />} />
        </Routes>
      </BrowserRouter>
    )
}

export default App;