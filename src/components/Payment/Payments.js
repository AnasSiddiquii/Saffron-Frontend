import React, { useState, useEffect } from 'react'
import * as RiIcons from 'react-icons/ri';
import { useParams } from 'react-router-dom';

const Payment = () => {
    const params = useParams()
    const [delay,setDelay] = useState(true)

    const [customer,setCustomer] = useState('')
    const [security,setSecurity] = useState('')
    const [balance,setBalance] = useState('')
    const [transaction,setTransaction] = useState([])

    useEffect(()=>{
        setTimeout(() => setDelay(false), 9999)
        getCustomer()
        // eslint-disable-next-line 
    },[])
    
    // Get Data
    const getCustomer = async () => {
        let result = await fetch('https://next.iice.foundation/customers')
        result = await result.json()

        if(result){    
            // Get Customer Name
            let customer = result.filter((i)=>(i._id===params.id))
            setCustomer(customer[0].name)
            setSecurity(customer[0].security)
            
            // Get Total Price
            let sum1 = 0
            const orders = customer.map((i)=>( i.orders.map((i)=>(i)) ))
            const bill = orders[0].map((i)=>(i.total))
            for (let i of bill){ sum1 = sum1 + i }
            
            // Get Total Amount
            let sum2 = 0
            let payments = customer.map((i)=>( i.payments.map((i)=>(i)) ))
            let paid = payments[0].map((i)=>(i.amount))
            for (let i of paid){ sum2 = sum2 + i }
            
            // Get Total Balance
            setBalance(sum2-sum1)

            // Get Transaction List
            let list = [...orders[0], ...payments[0]].sort((a,b)=>b.date>a.date?1:-1)
            setTransaction(list)
            
        }
    }

    return (
        <>
            <div className='float bg-light pb-1'>
                <div className='bg-primary navbar p-3'>
                    <div className='text-light head'>The Saffron</div>
                    <div className="text-light float-right head"><RiIcons.RiLogoutCircleLine/></div>
                </div>
                <h2 className='text-dark mt-4'>Payment History of {customer}</h2>
                <center>
                    <div className='col-11 p-4 mt-3 mb-2 rounded border shadow'>
                        <h3 className='left'><span> Security&nbsp;: </span>
                        <span className='text-success'>₹{security}/-</span></h3>
                        <h3 className='left mt-4'><span> Balance&nbsp;: </span>
                        <span className={`${balance<0?'text-danger':'text-success'}`}>{balance<0?'- ₹':'₹'}{balance<0?-(balance):balance}/-</span></h3>
                    </div>
                </center>
            </div>
            
            {
                transaction.length>0?
                transaction.map((i,index)=>(
                    <div key={index}>
                        {i.amount?
                        
                        <div className='left mt-2'>&nbsp;
                        <div  className='btn btn-dark col-10 shadow'>
                            <div className='row mt-2 pt-1 pb-1 padding'>
                                <h4 className='col-6 left text-success mt-2'>₹{i.amount}/-</h4>
                                <div className='col-6 right'>
                                    <h4>{i.date.split('-')[2]}-{i.date.split('-')[1]}-{i.date.split('-')[0]}</h4>
                                    <center className='text-warning paid'>Paid</center>
                                </div>
                            </div>
                        </div>
                        </div>:
                        
                        <div className='right mt-2'>
                            <div className='btn btn-dark col-10 shadow'>
                                <div className='row mt-2 pt-1 pb-1 padding'>
                                    <div className='col-6 left'>
                                        <h4>{i.date.split('-')[2]}-{i.date.split('-')[1]}-{i.date.split('-')[0]}</h4>
                                        <center className='text-warning meal'>{i.meal}</center>
                                    </div>
                                    <h4 className='col-6 right text-danger mt-2'>₹{i.total}/-</h4>
                                </div>
                            </div>&nbsp;
                        </div>}
                    </div>
                )):
                delay?
                <h2 className='mt-5'>Loading <div className="spinner-border" role="status"></div></h2>:
                <h2 className='text-danger mt-5'>No Details Found</h2>
            }

        </>
    )
}

export default Payment
