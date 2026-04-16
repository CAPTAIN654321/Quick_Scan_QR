"use client"
import Link from 'next/link';
import React from 'react';
import QRCode from 'react-qr-code';


const QRGenerator = () => {
  const [link, setLink] = React.useState('');
  return (
    <div style={{textAlign:"center", padding:"40px"}}>
        <h2>Generate QR code</h2>
        <input
        type='text'
        placeholder='Enter Your Link'
        value={link}
        onChange={(e)=>setLink(e.target.value)}
        style={{
            padding:'10px',
            width:'300px',
            marginTop:'20px'
        }}/>
        <div style={{marginTop:"30px"}}>
        {link && <QRCode value={link} size={200}/>}
        </div>
    </div>
  );
}

export default QRGenerator