// import React from 'react'

// const Spinner = () => {
//   return (
//     <div className='animate-ping w-16 h-16 m-8 rounded-full bg-sky-600'></div>
//   )
// }

// export default Spinner
import React from 'react';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>
  );
};

export default Spinner;
