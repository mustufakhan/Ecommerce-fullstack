import React, { Fragment, useEffect } from "react";
import { Products } from "./Products";
import './Home.css'
import MetaData from "../layout/MetaData";
import {getProduct} from '../../actions/productAction';
import {useDispatch, useSelector} from 'react-redux'
const Home = () =>{
	const dispatch = useDispatch();

	const product = {
		name: "njsd",
		images: ["https://images.unsplash.com/photo-1534644107580-3a4dbd494a95?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dGVzdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"],
		price: 100,
		_id: "ksmkd"
	};

	useEffect(()=>{
		dispatch(getProduct)
	},[dispatch])
	return(
		<Fragment>
			<MetaData title="Ecommerce"/>
			<div className="banner">
				<p>Welcome to Ecommerce</p>
				<h1>FIND AMAZING PRODUCTS BELOW</h1>
				<a href="#container">
					<button>
						Scroll
					</button>
				</a>
			</div>
			<h2 className="homeHeading">Featured Products</h2>
			<div className="container" id="container">
				<Products product={product}/>
				<Products product={product}/>
				<Products product={product}/>
				<Products product={product}/>
				<Products product={product}/>
				<Products product={product}/>
				<Products product={product}/>
				<Products product={product}/>
				<Products product={product}/>
			</div>
		</Fragment>
	)
}
export default Home;