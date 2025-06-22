import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';

import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext.tsx';
import LoginView from './views/main/LoginVew.tsx';
import RegisterView from './views/main/RegisterView.tsx';
import MainView from './views/main/MainView.tsx';
import UsersListView from './views/admin/users/UserListView.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/login" element={<LoginView />} />
          <Route path="/auth/register" element={<RegisterView/>} />

          {/* ADMIN MODE */}
          <Route path='/admin/' element={<UsersListView />} />

          {/* Main application route */}
          <Route path="/" element={<MainView />} />

        </Routes>
      </BrowserRouter>
    </AppProvider>
  </StrictMode>,
)
