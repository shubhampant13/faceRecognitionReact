import React from 'react';

const Rank = ({name,entries}) => {
   return (
   	  <div>
   		<div className="white f3">
           {`${name} , Number of times you have used this app is...`}
   		</div>
   		<div className="white f2">
           {entries}
   		</div>
   	  </div>
   	);
}

export default Rank;