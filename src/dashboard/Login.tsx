import React, { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { session, loading, configured, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <div className="min-h-screen grid place-items-center">جار التحميل...</div>;
  if (session) return <Navigate to={(location.state as { from?: string })?.from || '/admin'} replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    const result = await signIn(email, password);
    setSubmitting(false);
    if (result.error) setError(result.error);
    else navigate('/admin');
  };

  return (
    <main className="min-h-screen bg-cream grid place-items-center p-6" dir="rtl">
      <form onSubmit={submit} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-5">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">لوحة إدارة عطر</h1>
          <p className="text-gray-500 mt-2">سجّل الدخول لإدارة محتوى المتجر.</p>
        </div>
        {!configured && <p className="rounded-lg bg-amber-50 text-amber-800 p-3 text-sm">Supabase غير مهيأ. أضف متغيرات البيئة الموضحة في ملف الإعداد.</p>}
        {error && <p className="rounded-lg bg-red-50 text-red-700 p-3 text-sm">{error}</p>}
        <label className="block space-y-2"><span>البريد الإلكتروني</span><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" /></label>
        <label className="block space-y-2"><span>كلمة المرور</span><input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" /></label>
        <button disabled={submitting || !configured} className="btn-primary w-full disabled:opacity-50">{submitting ? 'جار الدخول...' : 'دخول'}</button>
      </form>
    </main>
  );
};

export default Login;
