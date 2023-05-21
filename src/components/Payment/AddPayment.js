import React, { useState, useEffect } from 'react'
import { Button, TextField } from "@mui/material";
import * as MdIcons from 'react-icons/md';
import * as RiIcons from 'react-icons/ri';
import { NavLink, useParams, useNavigate } from 'react-router-dom';

const AddPayment = () => {
    const navigate = useNavigate()
    const params = useParams()

    const [delay,setDelay] = useState(true)
    const [disabled,setDisabled] = useState(false)
    const [history, setHistory] = useState(false)

    const [customer,setCustomer] = useState('')
    const [bill,setBill] = useState('')
    const [paid,setPaid] = useState('')
    const [balance,setBalance] = useState('')
    const [orders,setOrders] = useState('')
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
            
            // Get Total Price
            let sum1 = 0
            const orders = customer.map((i)=>( i.orders.map((i)=>(i)) ))
            const bill = orders[0].map((i)=>(i.total))
            for (let i of bill){ sum1 = sum1 + i }
            setBill(sum1)
            
            // Get Total Amount
            let sum2 = 0
            let payments = customer.map((i)=>( i.payments.map((i)=>(i)) ))
            let paid = payments[0].map((i)=>(i.amount))
            for (let i of paid){ sum2 = sum2 + i }
            setPaid(sum2)

            // Get Total Balance
            setBalance(sum2-sum1)
            
            // Get Total Orders
            let sum3 = 0
            let a = customer.map((i)=>( i.orders.map((i)=>(i)) ))
            let quantity = a[0].map((i)=>(i.quantity))
            for (let i of quantity){ sum3 = sum3 + i }
            setOrders(sum3)
            
            // Get Transaction List
            let list = [...orders[0], ...payments[0]].sort((a,b)=>b.date>a.date?1:-1)
            setTransaction(list)
            
        }
    }

    // Delete Order
    const removeOrder = async (id) => {
        const comfirmBox = window.confirm("Are You Sure?")
        if(comfirmBox === true){
            let result = await fetch(`https://next.iice.foundation/deleteOrder/${params.id}/${id}`,{
                method:'delete'
            })
            result = await result.json()

            if(result.message){
                alert(result.message)
                getCustomer()
            }
            else{
                alert(result.error)
            }
        }
    }

    // Delete Payment
    const removePayment = async (id) => {
        const comfirmBox = window.confirm("Are You Sure?")
        if(comfirmBox === true){
            let result = await fetch(`https://next.iice.foundation/deletePayment/${params.id}/${id}`,{
                method:'delete'
            })
            result = await result.json()
            
            if(result.message){
                alert(result.message)
                getCustomer()
            }
            else{
                alert(result.error)
            }
        }
    }
    


    // Add Payment

    // Get Today's Date
    const d = new Date()
    let year = d.getFullYear()
    
    let month = d.getMonth()+1
    if(month<10){month = '0'+month}
    
    let day = (d.getDate())
    if(day<10){day = '0'+day}

    const date = year+'-'+month+'-'+day

    const [payment,setPayment] = useState({ date: date, amount: '' })
    
    let name, value
    const handleInputs = (e) => {
        name = e.target.name
        value = e.target.value
        setPayment({ ...payment, [name]: value })
    }

    const submit = async () => {
        try{
            setDisabled(true)
            const { date, amount } = payment
            
            let result = await fetch(`https://next.iice.foundation/addPayment/${params.id}`,{
                method:'post',
                body:JSON.stringify({ date, amount }),
                headers:{'Content-Type':'application/json'}
            })
            result = await result.json()
            
            if(result.message){
                alert(result.message)
                getCustomer()
                setDisabled(false)
            }
            else{
                setDisabled(false)
                alert(result.error)
            }
        }
        catch{
          setDisabled(false)
          alert("Error")
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
                    <NavLink to='/home' className='link text-light head'>The Saffron</NavLink>
                    <a href={`https://new.iice.foundation/#/payments/${params.id}`} target='blank' className="link text-light float-right head"><MdIcons.MdAddAPhoto/></a>
                    <NavLink to="/" className="link text-light float-right head" onClick={logout}><RiIcons.RiLogoutCircleLine/></NavLink>
                </div>
                <NavLink className='link' to={`/addOrder/${params.id}`}><h2 className='text-dark mt-4'>Add Payment for {customer}</h2></NavLink>
                <center>
                    {history?
                    <div className='col-11 pt-4 pb-3 mt-3 mb-2 rounded border shadow history' onClick={()=>setHistory(!history)}>
                        <h3 className='left'><span> Total&nbsp;Bill&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </span><span className='text-danger'>₹{bill}/-</span></h3>
                        <h3 className='left'><span> Total&nbsp;Paid&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </span><span className='text-success'>₹{paid}/-</span></h3>
                        <h3 className='left'><span> Total&nbsp;Orders&nbsp;: </span><span className='text-success'>{orders}</span></h3>
                    </div>:
                    <div className='col-11 p-4 mt-3 mb-2 rounded border shadow'>
                        <h3 className='left' onClick={()=>setHistory(!history)}><span> Balance&nbsp;: </span>
                        <span className={`${balance<0?'text-danger':'text-success'}`}>{balance<0?'- ₹':'₹'}{balance<0?-(balance):balance}/-</span></h3>
                        <div className='left row'>&nbsp;&nbsp;&nbsp;
                            <TextField label="Set Amount" variant="standard" type='number' className='col-6' autoComplete='off' name='amount' onChange={handleInputs} />
                            <div className='col-3 col-md-2 p-2 mt-1'>
                                {disabled?
                                    <Button variant="contained" type="submit" disabled onClick={submit}>Pay</Button>
                                    :<Button variant="contained" type="submit" onClick={submit}>Pay</Button>
                                }
                            </div>
                        </div>
                    </div>}
                </center>
            </div>
            
            {
                transaction.length>0?
                transaction.map((i,index)=>(
                    <div key={index}>
                        {i.amount?
                        
                        <div className='left mt-2'>&nbsp;
                        <NavLink to={'/editPayment/'+params.id+'/'+i._id}  className='btn btn-dark col-10 shadow'>
                            <div className='row mt-2 pt-1 pb-1 padding'>
                                <h4 className='col-6 left text-success mt-2'>₹{i.amount}/-</h4>
                                <div className='col-6 right'>
                                    <h4>{i.date.split('-')[2]}-{i.date.split('-')[1]}-{i.date.split('-')[0]}</h4>
                                    <center className='text-warning paid'>Paid</center>
                                </div>
                            </div>
                        </NavLink>
                        &nbsp;&nbsp;&nbsp;<MdIcons.MdDeleteForever className='delete text-danger' onClick={()=>{removePayment(i._id)}} />
                        </div>:
                        
                        <div className='right mt-2'>
                            <MdIcons.MdDeleteForever className='delete text-danger' onClick={()=>{removeOrder(i._id)}} />&nbsp;&nbsp;&nbsp;
                            <NavLink to={'/editOrder/'+params.id+'/'+i._id} className='btn btn-dark col-10 shadow'>
                                <div className='row mt-2 pt-1 pb-1 padding'>
                                    <div className='col-6 left'>
                                        <h4>{i.date.split('-')[2]}-{i.date.split('-')[1]}-{i.date.split('-')[0]}</h4>
                                        <center className='text-warning meal'>{i.meal}</center>
                                    </div>
                                    <h4 className='col-6 right text-danger mt-2'>₹{i.total}/-</h4>
                                </div>
                            </NavLink>&nbsp;
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

export default AddPayment
