import React from 'react';

function Awards() {
    return ( 
        <div className='container   mb-5'>
            <div className='row'>
                <div className='col-6' p-5>
                  <img src='media/image/largestBroker.svg'/>

                </div>
                <div className='col-6 p-5 mt-3'>
                    <h1>Largest stock broker in India</h1>
                    <p className='mb-5'>2+ million Zerodha client contribute to over 15% of all retail order volumes in india daily by tracking and investing in:</p>
                    <div className='row'>
                        <div className='col-6'>
                              <ul>
                        <li>
                            <p>Future and Options</p>
                        </li>
                        <li>
                            <p>Commodity derivatives</p>
                        </li>
                        <lI>
                            <p>Currency derivaties</p>
                        </lI>
                    </ul>
                        </div>
                        <div className='col-6'>
                              <ul>
                        <li>
                            <p> Stock and IPOs</p>
                        </li>
                        <li>
                            <p>Direct mutual funds</p>
                        </li>
                        <lI>
                            <p>Bonds and Govt Security</p>
                        </lI>
                    </ul>
                        </div>
                    </div>
                  
                <img src='media\image\pressLogos.png' style={{width:"90%"}} />
                </div>
            </div>

        </div>
    
    );
}

export default Awards;