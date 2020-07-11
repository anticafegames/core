import React from 'react'
import { toast, ToastOptions } from 'react-toastify'

export function elementToast(element: JSX.Element, toastOptions?: ToastOptions) {
    toast.info(element, {
        position: "top-right",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        ...toastOptions
    })
}

export function messageToast(text: string, toastOptions?: ToastOptions) {
    toast.info(text, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        ...toastOptions
    })
}