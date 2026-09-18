// import React from 'react';

// function Education() {
//     return ( 
//        // <h1> Education </h1>

//          <div className='container  mt-5 '>
//             <div className='row'>
//                 <div className='col-6'>
//                     <img src='media/image/education.svg' style={{width:'70%'}}/>

//                 </div>
//                 <div classNaame='col-6'>
//                     {/* <h1 className='mb-3 fs-2'>Free and open market education </h1>
//                     <p >Varsity, the largest online stock market education book in the world covering everything from the basics to advanced trading. </p>
//                     <a href='' style={{ textDecoration: "none" }}>Varsity<i class="fa-solid fa-arrow-right"></i></a>

//                     <p className='mt-5'>TradingQ&A, the most active trading and investment community in India for all your market related queries.  </p>
//                     <a href='' style={{ textDecoration: "none" }}> Trading Q&A <i class="fa-solid fa-arrow-right"></i></a> */}

//                 </div>
//                  <div className='col-6'>
//                     <h1 className='mb-3 fs-2'>Free and open market education </h1>
//                     <p >Varsity, the largest online stock market education book in the world covering everything from the basics to advanced trading. </p>
//                     <a href='' style={{ textDecoration: "none" }}>Varsity<i class="fa-solid fa-arrow-right"></i></a>

//                     <p className='mt-5'>TradingQ&A, the most active trading and investment community in India for all your market related queries.  </p>
//                     <a href='' style={{ textDecoration: "none" }}> Trading Q&A <i class="fa-solid fa-arrow-right"></i></a>
//                  </div>
                
                
//             </div>
//         </div>
//     );
// }

// export default Education;


import React from "react";

function Education() {
  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        
        {/* Left Side Image */}
        <div className="col-md-6">
          <img
            src="media/image/education.svg"
            alt="Education"
            style={{ width: "70%" }}
          />
        </div>

        {/* Right Side Content */}
        <div className="col-md-6">
          <h1 className="mb-3 fs-2">
            Free and open market education
          </h1>

          <p>
            Varsity, the largest online stock market education book in the
            world covering everything from the basics to advanced trading.
          </p>

          <a href="#" style={{ textDecoration: "none" }}>
            Varsity <i className="fa-solid fa-arrow-right"></i>
          </a>

          <p className="mt-5">
            TradingQ&A, the most active trading and investment community in
            India for all your market related queries.
          </p>

          <a href="#" style={{ textDecoration: "none" }}>
            Trading Q&A <i className="fa-solid fa-arrow-right"></i>
          </a>
        </div>

      </div>
    </div>
  );
}

export default Education;