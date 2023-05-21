import React from 'react'
import {NavLink, useNavigate} from 'react-router-dom';
import * as RiIcons from 'react-icons/ri';

const Navbar = () => {
    const navigate = useNavigate()

    const logout = () => {
        localStorage.clear()
        navigate('/')
    }

    return (
        <div className='bg-primary navbar p-3'>
            <NavLink to='/home' className='link text-light head'>The Saffron</NavLink>
            <NavLink to="/" className="link text-light float-right head" onClick={logout}><RiIcons.RiLogoutCircleLine/></NavLink>
        </div>
    )
}

export default Navbar
