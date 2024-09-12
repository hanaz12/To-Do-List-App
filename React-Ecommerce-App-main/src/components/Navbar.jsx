import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from "react-redux";

const Navbar = () => {
  const state = useSelector((state)=> state.handleCart)
  return (
    <div> <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand fw-bold fs-4" href="#">𝒮𝐻𝒪𝒫𝒫𝐸𝑅</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link" aria-current="page" href="/">𝐇𝐨𝐦𝐞</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/products">𝐏𝐫𝐨𝐝𝐮𝐜𝐭𝐬</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href='/about'>𝐀𝐛𝐨𝐮𝐭</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href='/contact'>𝐂𝐨𝐧𝐭𝐚𝐜𝐭</a>
          </li>
        </ul>
        <div className="buttons">
            <button className='btn'>
                <NavLink to='/login' className="btn btn-outline-dark">
                    <i className="fa fa-sign-in me-1"></i>𝐋𝐨𝐠𝐢𝐧</NavLink>
                <NavLink to='/register' className="btn btn-outline-dark">
                    <i className="fa fa-user-plus me-1"></i>𝐑𝐞𝐠𝐢𝐬𝐭𝐞𝐫</NavLink>
                <NavLink to='/cart' className="btn btn-outline-dark">
                    <i className="fa fa-shopping-cart me-2"></i>𝐂𝐚𝐫𝐭 ({state.length})</NavLink>
                    
            </button>
        </div>
      </div>
    </div>
  </nav></div>
  )
}

export default Navbar
