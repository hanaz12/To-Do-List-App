import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { NavLink } from 'react-router-dom';
import './Prod.css'

const Product = () => {
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let componentMounted = true;

        const getProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://dummyjson.com/products');
                const responseData = await response.json();
                if (componentMounted) {
                    setData(responseData.products); // Extracting 'products' array from response data
                    setFilter(responseData.products); // Set filter state with the fetched products
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        }

        getProducts();

        return () => {
            componentMounted = false;
        }
    }, []);

    const Loading = () => {
        return (
            <>
                <div className="col-md-3">
                    <Skeleton height={350}/>
                </div>
                <div className="col-md-3">
                    <Skeleton height={350}/>
                </div>
                <div className="col-md-3">
                    <Skeleton height={350}/>
                </div>
            </>
        )
    }

    const filterProducts = (cat) => {
        const updatedList = data.filter((x)=>x.category === cat);
        setFilter(updatedList);
    }

    const ShowProducts = () => {
        return (
            <>
                <div className="buttons d-flex justify-content-center mb-5 pb-5">
                    <button className="btn btn-outline-dark me-2" onClick={()=>setFilter(data)}>All</button>
                    <button className="btn btn-outline-dark me-2" onClick={()=>filterProducts("smartphones")}>Smartphones</button>
                    <button className="btn btn-outline-dark me-2" onClick={()=>filterProducts("laptops")}>Laptops</button>
                    <button className="btn btn-outline-dark me-2" onClick={()=>filterProducts("fragrances")}>Fragrances</button>
                    <button className="btn btn-outline-dark me-2" onClick={()=>filterProducts("skincare")}>Skincare</button>
                    <button className="btn btn-outline-dark me-2" onClick={()=>filterProducts("groceries")}>Groceries</button>
                    <button className="btn btn-outline-dark me-2" onClick={()=>filterProducts("home-decoration")}>Home Decoration</button>
                    {/* Add other category buttons as needed */}
                </div>
                {Array.isArray(filter) && filter.map((product) => (
                <div className="col-md-3 mb-4" key={product.id}>
                    <div id='a' className="card h-100 text-center p-4">
                        <img src={product.thumbnail} className="card-img-top" alt={product.title} height="250px"/>
                        <div className="card-body">
                            <h5 className="card-title mb-0">{product.title}</h5>
                            <p className="card-text lead fw-bolder">${product.price}</p>
                            <NavLink to={`/products/${product.id}`} className="btn btn-outline-dark">Buy Now</NavLink>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}
    

    return (
        <div>
            <div className="container my-5 py-5">
                <div className="row">
                    <div className="col-12 mb-5">
                        <h1 className='display-6 fw-bolder text-center'>Latest Products</h1>
                        <hr />
                    </div>
                </div>
                <div className='row justify-content-center'>
                    {loading ? <Loading /> : <ShowProducts />}
                </div>
            </div>
        </div>
    );
}

export default Product;
