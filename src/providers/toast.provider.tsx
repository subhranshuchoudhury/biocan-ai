"use client"
import { PropsWithChildren } from "react";
import { ToastContainer } from "react-fox-toast"
export const ToastProvider = ({ children }: PropsWithChildren) => {




    return (
        <>
            <ToastContainer position="top-center" />
            {children}
        </>
    );
};