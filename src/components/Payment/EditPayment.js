import React,{useState,useEffect} from 'react';
import Navbar from '../Navbar';
import {TextField, Button} from '@mui/material';
import { NavLink,useNavigate, useParams } from 'react-router-dom'

const EditPayment = () => {
    const navigate = useNavigate()
    const params = useParams()
    const [disabled,setDisabled] = useState(false)
    
    const [payment,setPayment] = useState({ date: '', amount: '' })
    
    useEffect(()=>{
        getPayment()
        // eslint-disable-next-line 
      },[])
    
    // Pre-Filled Data
    const getPayment = async () => {
        let result = await fetch(`https://next.iice.foundation/editPayment/${params.id}/${params.id2}`)
        result = await result.json()
        setPayment(result)
    }
    
    let name, value
    const handleInputs = (e) => {
        name = e.target.name
        value = e.target.value
        setPayment({ ...payment, [name]: value })
    }

    const submit = async (e) => {
        try{
            setDisabled(true)
            const { date, amount } = payment
            
            let result = await fetch(`https://next.iice.foundation/editPayment/${params.id}/${params.id2}`,{
                method:'put',
                body:JSON.stringify({ date, amount }),
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
            <NavLink className='link' to={`/addPayment/${params.id}`}><h2 className='text-dark mt-4'>Edit Payment</h2></NavLink>

            <div className="col-10 col-md-6 col-lg-4 mt-4">
                <TextField label="set Date" variant="outlined" type="date" className="form-control" name="date" format="MM/DD/YYYY"
                value={payment.date} onChange={handleInputs} />
            </div>

            <div className="col-10 col-md-6 col-lg-4 mt-4">
                <TextField label="Set Amount" variant="outlined" type="number" className="form-control" autoComplete='off' name="amount"  
                value={payment.amount} onChange={handleInputs} />
            </div>
            
            {disabled?
                <Button variant="contained" type="submit" className='col-4 col-md-2 mt-4 p-2' disabled onClick={submit}>Submit</Button>
                :<Button variant="contained" type="submit" className='col-4 col-md-2 mt-4 p-2' onClick={submit}>Submit</Button>
            }

        </center>
    )
}

export default EditPayment