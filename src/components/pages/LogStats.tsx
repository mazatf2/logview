import React from 'react'
import {PlayerStatsAll} from '../logstats/PlayerStatsAll'
import {useParams} from 'react-router-dom'
import {Redirect} from '../../loging'
import {isValidSteamId, parseSteamId} from '../searchforms/SearchLogListApiFormAdvanced'

export const LogStats = () => {
	let {steam64, ids} = useParams()
	let list = []
	let steamId = ''
	console.log(steam64)
	
	if (ids && ids.length > 1 && steam64 && steam64.length > 1) {
		try {
			const str = decodeURI(ids).trim()
			const temp = str.split(',')
				.map(i => parseInt(i))
				.filter(i => i && i)
				.filter(i => i.toString().length < 10)
			
			if (isValidSteamId(steam64))
				steamId = parseSteamId(steam64).getSteam3RenderedID()
			
			if (!steamId)
				return Redirect(['LogStats steamId', steam64])
			
			if (temp.length > 0) {
				list = temp
			} else {
				return Redirect(['LogStats ids', ids])
			}
		} catch (e) {
			return Redirect(['LogStats err', ids, steam64, e])
		}
	} else {
		return Redirect(['LogStats ids, steamId', ids, steam64])
	}
	
	return <PlayerStatsAll ids={list} steam64={steamId}/>
}