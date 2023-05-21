import React,{useState} from 'react';
import Navbar from '../Navbar';
import {TextField, Button, InputLabel, Select, MenuItem, FormControl} from '@mui/material';
import { useNavigate } from 'react-router-dom'

const AddCustomer = () => {
    const navigate = useNavigate()
    const [disabled,setDisabled] = useState(false)
 
    const [customer,setCustomer] = useState({ name: '', address: '', security: '', tiffin: '0' })
  
    let name, value
    const handleInputs = (e) => {
        name = e.target.name
        value = e.target.value
        setCustomer({ ...customer, [name]: value })
    }

    const submit = async () => {
        try{
            setDisabled(true)
            const { name, address, security, tiffin } = customer
            
            let result = await fetch('https://next.iice.foundation/addCustomer',{
                method:'post',
                body:JSON.stringify({ name, address, security, tiffin }),
                headers:{'Content-Type':'application/json'}
            })
            result = await result.json()
            
            if(result.message){
                alert(result.message)
                navigate('/home')
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
            <h2 className='mt-4'>Add Customer</h2>

            <div className="col-10 col-md-6 col-lg-4 mt-4">
                <TextField label="Enter Name" variant="outlined" type="text" className="form-control" autoComplete='off'  name="name"  
                onChange={handleInputs} />
            </div>

            <div className="col-10 col-md-6 col-lg-4 mt-4">
                <TextField label="Enter Address" variant="outlined" type="text" className="form-control" autoComplete='off'  name="address"  
                onChange={handleInputs} />
            </div>

            <div className="col-10 col-md-6 col-lg-4 mt-4">
                <FormControl fullWidth>
                    <InputLabel>Security Amount</InputLabel>
                    <Select label="Security Amount" value={customer.security} name='security' onChange={handleInputs} >
                        <MenuItem value='0'>0</MenuItem>
                        <MenuItem value='500'>500</MenuItem>
                        <MenuItem value='1000'>1000</MenuItem>
                        <MenuItem value='1500'>1500</MenuItem>
                    </Select>
                </FormControl>
            </div>

            {/* <div className="col-10 col-md-6 col-lg-4 mt-4">
                <TextField label="Security Amount" variant="outlined" type="number" className="form-control" autoComplete='off'  name="security"  
                onChange={handleInputs} />
            </div> */}
            
            {disabled?
                <Button variant="contained" type="submit" className='col-4 col-md-2 mt-4 p-2' disabled onClick={submit}>Submit</Button>
                :<Button variant="contained" type="submit" className='col-4 col-md-2 mt-4 p-2' onClick={submit}>Submit</Button>
            }

        </center>
    )
}

export default AddCustomer