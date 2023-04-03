import React, { FC, PropsWithChildren } from 'react'
import Loader from './Loader'

const Button: FC<PropsWithChildren<Props>> = ({
  isLoading,
  icon,
  disabled,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      className={`rounded-lg ${
        disabled
          ? 'bg-gray-300 opacity-60 cursor-not-allowed'
          : 'bg-gradient-to-r from-purple-400 to-pink-600 cursor-pointer'
      }  flex  py-4 px-6 ${props?.className}`}>
      {isLoading ? <Loader /> : children}

      {icon && <span className='ml-2'>{icon}</span>}
    </button>
  )
}

export default Button

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  icon?: React.ReactNode
}
