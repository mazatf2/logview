import React from 'react'

export const FormType = ({type, register}: { type: 'simple' | 'advanced' }) => {
	return <input
		style={{visibility: 'hidden'}}
		name='formType'
		defaultValue={type}
		ref={register}/>
}