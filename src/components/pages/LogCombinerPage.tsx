import React from 'react'
import {CombineLogs} from '../combinelogs/CombineLogs'
import {Redirect} from '../../loging'

type props = {
	ids: number[]
}

	
	if (typeof ids !== 'object' || ids.length < 1)
		return Redirect(['LogCombinerPage ids', ids])
	
	return <CombineLogs
		ids={ids}/>
}