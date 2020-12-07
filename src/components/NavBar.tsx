import React from 'react'
import {Link} from 'react-router-dom'
import './NavBar.css'

export const NavBar = () => {
	return <nav className="navbar">
		<div className="container">
			<div className="navbar-brand">
				<Link to="/"
					className="navbar-item">
					<div id="logo"></div>
				</Link>
			</div>
		</div>
	</nav>
}