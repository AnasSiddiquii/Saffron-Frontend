import React, { useEffect, useState } from 'react'
import {TextField, Button} from '@mui/material';
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()

  useEffect(()=>{
      const auth = localStorage.getItem('admin')
      if (auth)(
        navigate('/home')
      )
      // eslint-disable-next-line 
  },[])

  const [disabled,setDisabled] = useState(false)
  const [login,setLogin] = useState({ username: '', password: '' })
    
  let name, value
  const handleInputs = (e) => {
      name = e.target.name
      value = e.target.value
      setLogin({ ...login, [name]: value })
    }
    
  const submit = async () => {
    try{
      setDisabled(true)
      const { username, password } = login
      
      let result = await fetch('https://next.iice.foundation/login',{
        method:'post',
        body:JSON.stringify({ username, password }),
        headers:{'Content-Type':'application/json'}
      })
      result = await result.json()

      if(result._id){
        localStorage.setItem('admin',JSON.stringify({ _id:result._id }))
        alert('Login Successful')
        navigate('/productList')
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
        <div className='bg-primary navbar p-3'>
            <span className='text-light head'>The Saffron</span>
        </div>
        <h2 className='mt-4'>Login</h2>

        <div className="col-10 col-md-6 col-lg-4 mt-4">
            <TextField label="Enter Username" variant="outlined" type="text" className="form-control" autoComplete='off' name="username"  
            value={login.username} onChange={handleInputs} />
        </div>

        <div className="col-10 col-md-6 col-lg-4 mt-4">
            <TextField label="Enter Password" variant="outlined" type="password" className="form-control" autoComplete='off' name="password"  
            value={login.password} onChange={handleInputs} />
        </div>

        {disabled?
            <Button variant="contained" type="submit" className='col-4 col-md-2 mt-4 p-2' disabled onClick={submit}>Submit</Button>
            :<Button variant="contained" type="submit" className='col-4 col-md-2 mt-4 p-2' onClick={submit}>Submit</Button>
        }
        
    </center>
  )
}

export default Login
