import React, {useEffect, useState} from 'react'
import {average, sum} from '@bit/mazatf.components.utils'
import {fetchLogData} from '../../fetch'
import {logstfJson} from '../../logstf_api'
import {RoundInfo} from './RoundInfo'
import {CombineLogsPlayersTable} from './CombineLogsPlayersTable'
import {MedicStats} from './MedicStats'


type props = {
	ids: number[]
}

export const sumNoDecimals = (arr: number[]) => {
	if (!arr) return 0
	return Number(sum(arr)).toFixed(0)
}

export const medianDecimals = (arr: number[], decimals: number) => {
	if (!arr) return 0
	return Number(average(arr)).toFixed(decimals)
}

export const CombineLogs = ({ids}: props) => {
	const [logsArr, setLogsArr] = useState<logstfJson[]>([])
	console.log('CombineLogs', ids)
	
	useEffect(() => {
		const data = ids
			.map(id => fetchLogData(id))
		
		Promise.all(data)
			.then((logs) => {
				
				setLogsArr(logs)
				console.log('setLogsArr', logs, logsArr)
			})
	}, [ids])
	
	return <div className="section">
		<div className="container">
			<CombineLogsPlayersTable logsArr={logsArr}/>
			<RoundInfo logsArr={logsArr} ids={ids}/>
			<MedicStats logsArr={logsArr} ids={ids}/>
		</div>
	</div>
}