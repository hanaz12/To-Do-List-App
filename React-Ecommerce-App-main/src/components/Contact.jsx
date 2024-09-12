import React from 'react'
import './Contact.css'
import footer_logo from '../icons/Assets/logo_big.png'
import instagram_icon from '../icons/Assets/instagram_icon.png'
import pintester_icon from '../icons/Assets/pintester_icon.png'
import whatsapp_icon from '../icons/Assets/whatsapp_icon.png'
import lolo from '../icons/Assets/1234.png'

const Contact = () => {
  return (
    <div className='contact'>
      <div className="contact-logo">
      <img src={lolo} alt=""/>
        <p>𝐒𝐇𝐎𝐏𝐏𝐄𝐑</p>
      </div>
      <ul className='contact-links'>
        <li>Company</li>
        <li>Offices</li>
      </ul>
      <div className='contact-social-icon'>
        <div className="contact-icons-container">
            <img src={instagram_icon} alt=""/>
        </div>
        <div className="contact-icons-container">
            <img src={pintester_icon} alt=""/>
        </div>
        <div className="contact-icons-container">
            <img src={whatsapp_icon} alt=""/>
        </div>
      </div>
      <div className="contact-copyright">
        <hr/>
        <p>Copyright @ 2024 - All Right Reserved</p>
      </div>
    </div>
  )
}

export default Contact