import React,{useState,useEffect} from 'react';
import Navbar from '../Navbar';
import {TextField, Button, InputLabel, Select, MenuItem, FormControl} from '@mui/material';
import { NavLink,useParams,useNavigate } from 'react-router-dom'

const EditTiffin = () => {
    const navigate = useNavigate()
    const params = useParams()
    const [disabled,setDisabled] = useState(false)
    
    const [order,setOrder] = useState({ date: '', meal: '', price: '', quantity: '' })
    
    useEffect(()=>{
        getOrder()
        // eslint-disable-next-line 
      },[])
    
    // Pre-Filled Data
    const getOrder = async () => {
        let result = await fetch(`https://next.iice.foundation/editOrder/${params.id}/${params.id2}`)
        result = await result.json()
        setOrder(result)
    }
    
    let name, value
    const handleInputs = (e) => {
        name = e.target.name
        value = e.target.value
        setOrder({ ...order, [name]: value })
    }
    
    const submit = async (e) => {
        try{
            setDisabled(true)
            const { date, meal, price, quantity } = order
            const total = price*quantity
            
            let result = await fetch(`https://next.iice.foundation/editOrder/${params.id}/${params.id2}`,{
                method:'put',
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
            <NavLink className='link' to={`/addPayment/${params.id}`}><h2 className='text-dark mt-4'>Edit Order</h2></NavLink>

            <div className="col-10 col-md-6 col-lg-4 mt-4">
                <TextField label="Edit Date" variant="outlined" type="date" className="form-control" name="date" format="MM/DD/YYYY"
                value={order.date} onChange={handleInputs} />
            </div>

            <div className="col-10 col-md-6 col-lg-4 mt-4">
                <FormControl fullWidth>
                    <InputLabel >Edit Meal</InputLabel>
                    <Select label="Edit Meal" value={order.meal} name='meal' onChange={handleInputs}>
                        <MenuItem value='Iftar'>Iftar</MenuItem>
                        <MenuItem value='Breakfast'>Breakfast</MenuItem>
                        <MenuItem value='Lunch'>Lunch</MenuItem>
                        <MenuItem value='Dinner'>Dinner</MenuItem>
                    </Select>
                </FormControl>
            </div>

            <div className="col-10 col-md-6 col-lg-4 mt-4">
                <FormControl fullWidth>
                    <InputLabel>Edit Price</InputLabel>
                    <Select label="Edit Price" value={order.price} name='price' onChange={handleInputs} >
                        <MenuItem value='60'>60</MenuItem>
                        <MenuItem value='80'>80</MenuItem>
                        <MenuItem value='100'>100</MenuItem>
                        <MenuItem value='120'>120</MenuItem>
                    </Select>
                </FormControl>
            </div>

            <div className="col-10 col-md-6 col-lg-4 mt-4">
                <FormControl fullWidth>
                    <InputLabel>Edit Quantity</InputLabel>
                    <Select label="Edit Quantity" value={order.quantity} name='quantity' onChange={handleInputs} >
                        <MenuItem value='1'>1</MenuItem>
                        <MenuItem value='2'>2</MenuItem>
                        <MenuItem value='3'>3</MenuItem>
                        <MenuItem value='4'>4</MenuItem>
                    </Select>
                </FormControl>
            </div>

            {/* <div className="col-10 col-md-6 col-lg-4 mt-4">
                <TextField label="Edit Price" variant="outlined" type="number" className="form-control" autoComplete='off'  name="price"  
                value={order.price} onChange={handleInputs} />
            </div>

            <div className="col-10 col-md-6 col-lg-4 mt-4">
                <TextField label="Edit Quantity" variant="outlined" type="number" className="form-control" autoComplete='off' name="quantity"  
                value={order.quantity} onChange={handleInputs} />
            </div> */}

            {disabled?
                <Button variant="contained" type="submit" className='col-4 col-md-2 mt-4 p-2' disabled onClick={submit}>Submit</Button>
                :<Button variant="contained" type="submit" className='col-4 col-md-2 mt-4 p-2' onClick={submit}>Submit</Button>
            }

        </center>
    )
}

export default EditTiffin