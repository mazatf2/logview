import React from 'react'
import {Row} from 'react-table'
import {logstfJson} from '../../logstf_api'
import {CombineLogsPlayersTable} from './CombineLogsPlayersTable'

export const RoundInfoRoundOverview = (row: Row, index: number) => {
	const log = row.original as logstfJson
	
	return <>
		<span>{log.info.title} - {log.info.map}</span>
		<CombineLogsPlayersTable logsArr={[log]} steam32=""/>
	</>
}