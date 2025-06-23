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
import UserFormView from './views/admin/users/UserFormView.tsx';
import NurmonsListView from './views/admin/nurmons/NurmonsListView.tsx';
import NurmonFormView from './views/admin/nurmons/NurmonFormView.tsx';
import ItemsListView from './views/admin/items/ItemListView.tsx';
import ItemFormView from './views/admin/items/ItemFormView.tsx';
import MovementsListView from './views/admin/movements/MovementsListView.tsx';
import MovementFormView from './views/admin/movements/MovementFormView.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/login" element={<LoginView />} />
          <Route path="/auth/register" element={<RegisterView/>} />

          {/* ADMIN MODE */}
          <Route path='/admin/' element={<UsersListView />} />
          <Route path='/admin/users/form/:id' element={<UserFormView />} />
          <Route path='/admin/nurmons/' element={<NurmonsListView />} />
          <Route path='/admin/nurmons/form/' element={<NurmonFormView />} />
          <Route path='/admin/nurmons/form/:id' element={<NurmonFormView />} />
          <Route path='/admin/items/' element={<ItemsListView />} />
          <Route path='/admin/items/form/' element={<ItemFormView />} />
          <Route path='/admin/items/form/:id' element={<ItemFormView />} />
          <Route path='/admin/movements/' element={<MovementsListView />} />
          <Route path='/admin/movements/form/' element={<MovementFormView />} />
          <Route path='/admin/movements/form/:id' element={<MovementFormView />} />

          {/* User management routes */}
 
          {/* Main application route */}
          <Route path="/" element={<MainView />} />

        </Routes>
      </BrowserRouter>
    </AppProvider>
  </StrictMode>,
)
