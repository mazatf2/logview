import React from 'react'

export const Form = ({...props}) => {
	return <form
		onSubmit={props.onSubmit}
	>
		{props.children}
	</form>
}