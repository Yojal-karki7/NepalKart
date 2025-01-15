import React from 'react';
import Title from '../components/Title'
import {assets} from '../assets/assets'
import NewsLaterBox from '../components/NewsLaterBox'

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={'Contact'} text2={'US'}/>
      </div>
      <div className="flex my-10 flex-col justify-center md:flex-row gap-10 mb-28">
        <img src={assets.contact_img} className='w-full md:max-w-[480px]' alt="" />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>7007 Mulpani<br /> Kageshwori 9, Mulpani, KTM</p>
          <p className='text-gray-500'>Tel: (977) 976481629 <br /> Email: yojalkarki74@gmal.com</p>
          <p className='font-semibold text-xl text-gray-600'>Carrers at NepalKart</p>
          <p className='text-gray-500'>Learn more about me.</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore</button>
        </div>
      </div>
      <NewsLaterBox />
    </div>
  )
}

export default Contact