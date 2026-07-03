import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoAndCurrentTime from '@/components/firstPage/LogoAndCurrentTime';
import { register } from '@/services/authService';

function SignUpPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill full name, email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ fullName: fullName.trim(), email: email.trim(), password: password.trim() });
      setSuccess('Account created successfully. Redirecting to login...');
      setTimeout(() => navigate('/user/login', { replace: true }), 1000);
    } catch (registerError) {
      setError(registerError?.message || 'Register failed. Please try another email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <LogoAndCurrentTime />
      <h1 className="text-2xl font-bold mb-4">Create Account</h1>

      <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
            placeholder="Enter your full name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
            placeholder="Create password"
          />
        </div>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
        {success && <p className="text-sm text-green-600 mb-3">{success}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-2 px-4 rounded-md shadow-sm hover:bg-primary-dark disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>

        <p className="mt-3 text-xs text-center text-zinc-700">
          Already have an account? <Link to="/user/login" className="underline">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default SignUpPage;