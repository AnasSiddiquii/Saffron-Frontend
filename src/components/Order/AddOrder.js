import React,{useState, useEffect} from 'react';
import Navbar from '../Navbar';
import {TextField, Button, InputLabel, Select, MenuItem, FormControl} from '@mui/material';
import { NavLink, useNavigate, useParams } from 'react-router-dom'

const AddOrder = () => {
    const navigate = useNavigate()
    const params = useParams()
    const [disabled,setDisabled] = useState(false)

    const [order,setOrder] = useState({ date: '', meal: '', price: '', quantity: '' })
    const [customer,setCustomer] = useState('')
    
    useEffect(()=>{
        getCustomer()
        // eslint-disable-next-line 
    },[])
    
    // Get Data
    const getCustomer = async () => {
        let result = await fetch('https://next.iice.foundation/customers')
        result = await result.json()
        if(result){    
            let customer = result.filter((i)=>(i._id===params.id))
            setCustomer(customer[0].name)
        }
    }



    let name, value
    const handleInputs = (e) => {
        name = e.target.name
        value = e.target.value
        setOrder({ ...order, [name]: value })
    }

    const submit = async () => {
        try{
            setDisabled(true)
            const { date, meal, price, quantity } = order
            const total = price*quantity
            
            let result = await fetch(`https://next.iice.foundation/addOrder/${params.id}`,{
                method:'post',
                body:JSON.stringify({ date, meal, price, quantity, total }),
                headers:{'Content-Type':'application/json'}
            })
            result = await result.json()
            
            if(result.message){
                alert(result.message)
                navigate(`/addPayment/${params.id}`)
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

    return (
        <center>
            <Navbar />
            <NavLink className='link' to={`/addPayment/${params.id}`}><h2 className='text-dark mt-4'>Add Order for {customer}</h2></NavLink>

            <div className="col-10 col-md-6 col-lg-4 mt-4">
                <TextField label="Set Date" variant="outlined" type="date" className="form-control" name="date" format="MM/DD/YYYY"
                onChange={handleInputs} />
            </div>

            <div className="col-10 col-md-6 col-lg-4 mt-4">
                <FormControl fullWidth>
                    <InputLabel>Set Meal</InputLabel>
                    <Select label="Set Meal" value={order.meal} name='meal' onChange={handleInputs} >
                        <MenuItem value='Iftar'>Iftar</MenuItem>
                        <MenuItem value='Breakfast'>Breakfast</MenuItem>
                        <MenuItem value='Lunch'>Lunch</MenuItem>
                        <MenuItem value='Dinner'>Dinner</MenuItem>
                    </Select>
                </FormControl>
            </div>

            <div className="col-10 col-md-6 col-lg-4 mt-4">
                <FormControl fullWidth>
                    <InputLabel>Set Price</InputLabel>
                    <Select label="Set Price" value={order.price} name='price' onChange={handleInputs} >
                        <MenuItem value='60'>60</MenuItem>
                        <MenuItem value='80'>80</MenuItem>
                        <MenuItem value='100'>100</MenuItem>
                        <MenuItem value='120'>120</MenuItem>
                    </Select>
                </FormControl>
            </div>

            <div className="col-10 col-md-6 col-lg-4 mt-4">
                <FormControl fullWidth>
                    <InputLabel>Set Quantity</InputLabel>
                    <Select label="Set Quantity" value={order.quantity} name='quantity' onChange={handleInputs} >
                        <MenuItem value='1'>1</MenuItem>
                        <MenuItem value='2'>2</MenuItem>
                        <MenuItem value='3'>3</MenuItem>
                        <MenuItem value='4'>4</MenuItem>
                    </Select>
                </FormControl>
            </div>

            {/* <div className="col-10 col-md-6 col-lg-4 mt-4">
                <TextField label="Set Price" variant="outlined" type="number" className="form-control" autoComplete='off' name="price"  
                onChange={handleInputs} />
            </div>

            <div className="col-10 col-md-6 col-lg-4 mt-4">
                <TextField label="Set Quantity" variant="outlined" type="number" className="form-control" autoComplete='off' name="quantity"  
                onChange={handleInputs} />
            </div> */}

            {disabled?
                <Button variant="contained" type="submit" className='col-4 col-md-2 mt-4 p-2' disabled onClick={submit}>Submit</Button>
                :<Button variant="contained" type="submit" className='col-4 col-md-2 mt-4 p-2' onClick={submit}>Submit</Button>
            }

        </center>
    )
}

export default AddOrder