import React, { useEffect, useState } from 'react'
import {NavLink, useNavigate} from 'react-router-dom';
import * as MdIcons from 'react-icons/md';
import * as RiIcons from 'react-icons/ri';


const Home = () => {
    const navigate = useNavigate()
    const [customer,setCustomer] = useState([])
    const [delay,setDelay] = useState(true)
    
    // stats
    const [history, setHistory] = useState(false)
    // search
    const [find, setFind] = useState(false)
    // edit
    const [show, setShow] = useState(false)
    // delete
    const [disabled,setDisabled] = useState(true)
    
    const [balance,setBalance] = useState('')
    const [security,setSecurity] = useState('')
    const [tiffin,setTiffin] = useState('')

    const [sales,setSales] = useState('')
    const [payments,setPaymemts] = useState('')
    const [orders,setOrders] = useState('')

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
            let list = result.sort((a,b)=>a.name>b.name?1:-1)
            setCustomer(list)
        }
    }
    
    // eslint-disable-next-line 
    useEffect(()=>{

        // Get Total Sales
        let sum1 = 0
        let price = customer.flatMap((i) => i.orders.map((i) => i.total));
        for (let i of price){ sum1 = sum1 + i }
        setSales(sum1)
        
        // Get Total Payments
        let sum2 = 0
        let amount = customer.flatMap((i) => i.payments.map((i) => i.amount));
        for (let i of amount){ sum2 = sum2 + i }
        setPaymemts(sum2)
        
        // Get Total Orders
        let sum3 = 0
        let quantity = customer.flatMap((i) => i.orders.map((i) => i.quantity));
        for (let i of quantity){ sum3 = sum3 + i }
        setOrders(sum3)
        
        // Get Total Balance
        setBalance(sum2-sum1)
        
        // Get Total Security
        let sum4 = 0
        let security = customer.map((i) => (i.security))
        for (let i of security){ sum4 = sum4 + i }
        setSecurity(sum4)
        
        // Get Total Tiffin
        let sum5 = 0
        let tiffin = customer.map((i)=>(i.tiffin))
        for (let i of tiffin){ sum5 = sum5 + i }
        setTiffin(sum5)
    
    })
    
    // Delete Data
    const remove = async (id) => {
        const comfirmBox = window.confirm("Are You Sure?")
        if(comfirmBox === true){
            let result = await fetch(`https://next.iice.foundation/deleteCustomer/${id}`,{
                method:'delete'
            })
            result = await result.json()
            if(result){
                getCustomer()
            }
        }
    }

    // Search Data
    const search = async(e) => {
        const key = e.target.value
        if(key){
            try{
                let result = await fetch(`https://next.iice.foundation/searchCustomer/${key}`)
                result = await result.json()
                if(result.result){
                    // getCustomer()
                }
                else{
                    setCustomer(result)
                }
            }
            catch{
                // getCustomer()
            }
        }
        else{
            getCustomer()
        }
    }
        
    const logout = () => {
        localStorage.clear()
        navigate('/')
    }
    
    return (
        <>
            <div className='float bg-light pb-1'>
                <div className='bg-primary navbar p-3'>
                    <span className='text-light head' onClick={()=>setShow(!show)}>The Saffron</span>
                    <span className='text-light head' onClick={()=>setFind(!find)}><RiIcons.RiUserSearchFill/></span>
                    <NavLink to="/" className="link text-light float-right head" onClick={logout}><RiIcons.RiLogoutCircleLine/></NavLink>
                </div>

                {find?
                    <button className='btn col-11 p-3 mt-4 mb-2 rounded border shadow' onClick={()=>setHistory(!history)}>
                        <input type="text" className="form-control" placeholder="Search....." onChange={search} />
                    </button>:
                    <>
                        {history?
                        <button className='btn col-11 p-3 mt-4 mb-2 rounded border shadow' onClick={()=>setHistory(!history)}>
                            <h3 className='left'><span className='text-dark'> Total&nbsp;Sales&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </span><span className='text-danger'>₹{sales}/-</span></h3>
                            <h3 className='left'><span className='text-dark'> Total&nbsp;Payments&nbsp;: </span><span className='text-success'>₹{payments}/-</span></h3>
                            <h3 className='left'><span className='text-dark'> Total&nbsp;Orders&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </span><span className='text-success'>{orders}</span></h3>
                        </button>:
                        <button className='btn col-11 p-3 mt-4 mb-2 rounded border shadow' onClick={()=>setHistory(!history)}>
                            <h3 className='left'><span className='text-dark'> Total&nbsp;Balance&nbsp;: </span>
                            <span className={`${balance<0?'text-danger':'text-success'}`}>{balance<0?'- ₹':'₹'}{balance<0?-(balance):balance}/-</span></h3>
                            <h3 className='left'><span className='text-dark'> Total&nbsp;Security&nbsp;: </span><span className='text-success'>₹{security}/-</span></h3>
                            <h3 className='left'><span className='text-dark'> Total&nbsp;Tiffin&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </span><span className='text-danger'>{tiffin}</span></h3>
                        </button>
                        }
                    </>
                }
            </div>
            
            {show?
            <div className='add btn btn-primary rounded-circle pb-1' onDoubleClick={()=>setDisabled(!disabled)}><h1><MdIcons.MdPersonAdd/></h1></div>
            :<NavLink to='/addCustomer' className='add btn btn-primary rounded-circle pb-1'><h1><MdIcons.MdPersonAdd/></h1></NavLink>
            }

            {
                customer.length>0?
                customer.map((i,index)=>(                
                    <center key={index}>
                        <div className='bg-dark col-11 p-4 mt-2 mb-3 rounded border'>
                            {show&&<>
                            <div className='row mb-2'>
                                <div className='col-2'></div>
                                <NavLink to={'/editCustomer/'+i._id} className='col-4 btn btn-success mt-1'>Edit</NavLink>&nbsp;
                                <button className={`col-4 btn btn-danger mt-1 ${disabled && 'disabled'}`} onClick={()=>{remove(i._id)}}>Delete</button>
                                <div className='col-2'></div>
                            </div>
                            <hr className='text-light' />
                            </>}


                            <NavLink to={'/addOrder/'+i._id} className='link'>
                                <div className='row'>
                                    <h3 className='text-light left'>{index+1}. {i.name}</h3>
                                </div>
                                <div className='row'>
                                    <h6 className='col-12 text-light left'>{i.address}</h6>
                                </div>

                                <div className='row'>
                                    <h4 className='col-5 text-light left'><span> Tiffin&nbsp;: </span> <span className='text-danger'>{i.tiffin}</span></h4>
                                    <h4 className='col-7 text-light right'><span> Security&nbsp;: </span> <span className='text-success'>₹{i.security}/-</span></h4>
                                </div>
                            </NavLink>
                    
                            <div className='row'>
                                <NavLink to={'/addpayment/'+i._id} className='btn btn-light mt-2'>
                                    <h5 className='mt-2'><span> Balance : </span>
                                    
                                    {/* for text color */}
                                    <span className={`${(i.payments.reduce((a, b) => a + b.amount, 0))-(i.orders.reduce((a, b) => a + b.total, 0))<0?'text-danger':'text-success'}`}>
                                        
                                        {/* for ₹ symbol */}
                                        {(i.payments.reduce((a, b) => a + b.amount, 0))-(i.orders.reduce((a, b) => a + b.total, 0))<0?'- ₹':'₹'}
                                        
                                        {/* for minus/plus */}
                                        {(i.payments.reduce((a, b) => a + b.amount, 0))-(i.orders.reduce((a, b) => a + b.total, 0))<0?
                                        -((i.payments.reduce((a, b) => a + b.amount, 0))-(i.orders.reduce((a, b) => a + b.total, 0))):
                                        (i.payments.reduce((a, b) => a + b.amount, 0))-(i.orders.reduce((a, b) => a + b.total, 0))}

                                    </span></h5>
                                    
                                </NavLink>
                            </div>

                        </div>
                    </center>
                )):
                delay?
                <h2 className='mt-5'>Loading <div className="spinner-border" role="status"></div></h2>:
                <h2 className='text-danger mt-5'>No Details Found</h2>
            }

        </>
    )
}

export default Home
