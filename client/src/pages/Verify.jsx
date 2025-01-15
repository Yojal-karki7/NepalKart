import React, { useContext, useEffect } from 'react'
import {ShopContext} from '../context/ShopContext'
import {useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const verify = () => {
    const {navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
    const [searchParms, setSearchParams] = useSearchParams();
    const success = searchParms.get('success')
    const orderId = searchParms.get('orderId')
    const verifYPayment = async()=>{
        try {
            if(!token) {
                return null
            }
            const response = await axios.post(backendUrl + '/api/order/verifystripe', {success, orderId}, {headers: {token}});
            if(response.data.success) {
                setCartItems({})
                navigate('/orders')
            }else{
                navigate('/cart')
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }
    useEffect(()=>{
        verifYPayment()
    },[token])
  return (
    <div>verify</div>
  )
}

export default verify