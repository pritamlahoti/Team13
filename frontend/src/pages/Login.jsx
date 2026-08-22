import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();

  const handleMentorLogin = async () => {
    const user = await authService.login('mentor@katalyst.com', 'password');
    if (user) {
      navigate('/mentor/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf8f5] p-4 font-sans text-theme-plum">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-theme-plum/10 max-w-sm w-full text-center">
        <h1 className="text-3xl font-black font-display mb-2 text-theme-berry">Katalyst</h1>
        <p className="text-slate-500 mb-8 text-sm">Empowering young women for leadership.</p>
        
        <button 
          onClick={handleMentorLogin}
          className="w-full py-4 bg-gradient-to-r from-theme-berry to-theme-peach text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
        >
          Login as Mentor
        </button>
      </div>
    </div>
  );
}
