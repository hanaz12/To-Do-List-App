import React from 'react'
import Product from './Product'

const Home = () => {
  return (
    <div className='hero'>
<div class="card text-bg-dark border-0">
  <img src="/assets/images/4.jpg" class="card-img" alt="..."/>
  {/* <img src="/assets/images/shirt.jpg" class="card-img" alt="..." /> */}
  <div class="card-img-overlay d-flex flex-column">
    <div class="container">
    <h5 class="card-title display-3 fw-bolder mb-0">DISCOVER THE BEST DEALS</h5>
    <p class="card-text fs-2">YOUR ONLINE SHOPPING DESTINATION</p>
    </div>
  </div>
</div>
<Product/>
    </div>
  )
}

export default Home