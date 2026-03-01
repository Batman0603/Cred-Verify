import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#efefef] dark:bg-slate-950">
      <Navbar />
      <div className="mx-auto flex max-w-[1440px] gap-4 px-4 py-4">
        <Sidebar role={user.role} />
        <main className="min-h-[calc(100vh-140px)] flex-1 border-4 border-black bg-[#f8f8f8] p-4 dark:border-slate-200 dark:bg-slate-900">
    <div>
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-4 px-4 py-4">
        <Sidebar role={user.role} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
