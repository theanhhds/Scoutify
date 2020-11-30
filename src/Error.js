import React from 'react';
import {NavLink} from 'react-router-dom';

const Error = () => {
    return (
	<div>
		<br/><br/><br/><br/>
		<div className="w3-display-container w3-padding-large">
			<div className="w3-display-topmiddle">
				<h1 className="w3-red">Error: Page does not exist!</h1>
				<h3 className="">The page you are looking is not exist</h3>
				<h5 className="">Please go back to <NavLink to="/">homepage</NavLink>!</h5>
			</div>
		</div>
	</div>
    );
}
 
export default Error;