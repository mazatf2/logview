import React, {useState} from 'react'
import {SelectLogsPage} from './SelectLogsPage'
import {CombineLogs} from '../combinelogs/CombineLogs'
import {LogCombinerPage} from './LogCombinerPage'
import SteamID from 'steamid'
import {Link} from 'react-router-dom'

export const DevPage = () => {
	const id = new SteamID('76561197996199110')
	const steam32 = id.getSteam3RenderedID()
	
	console.log('dev page')
	return <>
		<Link to="/log-combiner/1506035,1506078,1506121,1506164">CombineLogs</Link>
	</>
}