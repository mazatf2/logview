import React, {useEffect} from 'react'
import {LogApi} from '@bit/mazatf.components.log-api'
import {fetchLogZip} from '../../fetch'

export const Chart = ({logId}: { logId: string }) => {
	const chartData = new ChartData()
	
	useEffect(() => {
		const fetch = async () => {
			const log = await fetchLogZip(logId) as string
			console.log(log.length, log)
			
			const logParser = new LogApi()
			const events = logParser.parse(log)
			console.log(events)
			
			const t = chartData.prepareEvents(events, 1000)
			console.log(t)
			
		}
		fetch()
		
	}, [logId])
	
	
	return <div/>
}