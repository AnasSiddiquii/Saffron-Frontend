import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import {TextField, Button, InputLabel, Select, MenuItem, FormControl} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom'

const EditCustomer = () => {
    const navigate = useNavigate()
    const params = useParams()
    const [disabled,setDisabled] = useState(false)
    
    const [customer,setCustomer] = useState({ name: '', address: '', security: '', tiffin: '' })

    useEffect(()=>{
        getCustomer()
        // eslint-disable-next-line 
      },[])
    
    // Pre-Filled Data
    const getCustomer = async () => {
        let result = await fetch(`https://next.iice.foundation/editCustomer/${params.id}`)
        result = await result.json()
        setCustomer(result)
    }

    let name, value
    const handleInputs = (e) => {
        name = e.target.name
        value = e.target.value
        setCustomer({ ...customer, [name]: value })
    }

    const submit = async (e) => {
        try{
            setDisabled(true)
            const { name, address, security, tiffin } = customer
            
            let result = await fetch(`https://next.iice.foundation/editCustomer/${params.id}`,{
                method:'put',
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
            <h2 className='mt-4'>Edit Customer</h2>

            <div className="col-10 col-md-6 col-lg-4 mt-4">
                <TextField label="Enter Name" variant="outlined" type="text" className="form-control" autoComplete='off' name="name"  
                value={customer.name} onChange={handleInputs} />
            </div>

            <div className="col-10 col-md-6 col-lg-4 mt-4">
                <TextField label="Enter Address" variant="outlined" type="text" className="form-control" autoComplete='off'  name="address"  
                value={customer.address} onChange={handleInputs} />
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

            <div className="col-10 col-md-6 col-lg-4 mt-4">
                <FormControl fullWidth>
                    <InputLabel>Tiffin Box</InputLabel>
                    <Select label="Tiffin Box" value={customer.tiffin} name='tiffin' onChange={handleInputs} >
                        <MenuItem value='0'>0</MenuItem>
                        <MenuItem value='1'>1</MenuItem>
                        <MenuItem value='2'>2</MenuItem>
                        <MenuItem value='3'>3</MenuItem>
                    </Select>
                </FormControl>
            </div>

            {/* <div className="col-10 col-md-6 col-lg-4 mt-4">
                <TextField label="Security Amount" variant="outlined" type="number" className="form-control" autoComplete='off'  name="security"  
                value={customer.security} onChange={handleInputs} />
            </div>
            
            <div className="col-10 col-md-6 col-lg-4 mt-4">
                <TextField label="Tiffin" variant="outlined" type="number" className="form-control" autoComplete='off'  name="tiffin"  
                value={customer.tiffin}  onChange={handleInputs} />
            </div> */}
            
            {disabled?
                <Button variant="contained" type="submit" className='col-4 col-md-2 mt-4 p-2' disabled onClick={submit}>Submit</Button>
                :<Button variant="contained" type="submit" className='col-4 col-md-2 mt-4 p-2' onClick={submit}>Submit</Button>
            }

        </center>
    )
}

export default EditCustomer