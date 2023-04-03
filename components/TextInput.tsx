import React, { FC, useId } from 'react'

const TextInput: FC<Props> = ({ label, ...props }) => {
  const id = useId()

  return (
    <div>
      <label
        htmlFor={id}
        className='block text-sm font-medium leading-6 text-gray-400'>
        {label}
      </label>
      <div className='mt-2'>
        <input
          {...props}
          id={id}
          className={`px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${props?.className}`}
        />
      </div>
    </div>
  )
}

export default TextInput

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}
