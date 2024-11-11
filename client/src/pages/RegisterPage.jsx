import  { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

   async function registerUser(ev) {
    ev.preventDefault();

    try{
        await axios.post('http://localhost:4000/register',{
            name,
            email,
            password,
        });
        alert('Registration Successfull ! Now you can login ');

    }catch(e){
        alert('Registration Failure');

    }

    
     
  }

  return (
    <div className='mt-4 grow  flex items-center justify-around'>
      <div className='mb-64'>
        <h1 className='text-4xl text-center mb-4'>Register </h1>
        <form onSubmit={registerUser} className='mx-auto max-w-md'>
          <input
            type='text'
            placeholder='username'
            value={name}
            onChange={ev => setName(ev.target.value)}
          />
          <input
            type='email'
            placeholder='Your email address'
            value={email}
            onChange={ev => setEmail(ev.target.value)}
          />
          <input
            type="password"
            placeholder='your password'
            value={password}
            onChange={ev => setPassword(ev.target.value)}
          />
          <button
            type='submit' // Add type attribute
            className='primary'
          >
            Register
          </button>
          <div className='text-center py-2 text-gray-500'>
            Already a member <Link className='underline text-black' to='/login'>Login Now</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
