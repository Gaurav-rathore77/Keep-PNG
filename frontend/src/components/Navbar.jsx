import React from 'react'
import { Link } from 'react-router-dom';
function Navbar() {
  return (
    <div className="flex justify-between w-screen items-center p-4 bg-gray-800 text-white"> 
     <div>
        logo
     </div> 
        <div className='space-x-4 pr-4'>
            <Link to="/" className="hover:text-gray-300">Home</Link>
            <Link to="/register" className="hover:text-gray-300">Register</Link>
            <Link to="/createjob" className="hover:text-gray-300">jobcreate</Link>
        </div>
    </div>
  )
}

export default Navbar