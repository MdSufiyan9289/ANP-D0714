import React, { useContext } from 'react'
import { DataContext } from '../context/AppContext'

const Alert = () => {
    const {alert}=useContext(DataContext);
    return (
        alert&&<div className={`${alert.success ? "bg-green-200" : "bg-red-200"}  w-full py-5 px-12 border ${alert.success ? "border-green-600" : "border-red-600"} absolute z-20`}>
            <p className={`font-semibold text-md ${alert.success?"text-green-900":"text-red-900"}`}>{alert.message}</p>
        </div>
    )
}
export default Alert
