import React, {useEffect, useMemo, useState} from 'react'
import SteamID from 'steamid'
import {fetchLogData} from '../../fetch'
import {logstfJson} from '../../logstf_api'
import {IndeterminateCheckbox, MainTable} from '../loglisttable/MainTable'
import {Abbr} from '../combinelogs/Abbr'
import {Date} from '../loglisttable/cells/Date'

type props = {
	ids: number[]
	steam64: string
}

const numberCell = (steam32: string, key: string) => {
	return {
		Header: Abbr(key),
		id: key.toString(),
		accessor: log => log.players[steam32]?.[key],
		className: 'has-text-right',
	}
}

export const PlayerStatsAll = ({ids, steam64}: props) => {
	const [logsArr, setLogsArr] = useState<logstfJson[]>([])
	if (!ids || !steam64)
		return <>Loading...</>
	
	const id = new SteamID(steam64)
	const steam32 = id.getSteam3RenderedID()
	
	useEffect(() => {
		const data = ids
			.map(id => fetchLogData(id))
		
		Promise.all(data)
			.then((logs) => {
				setLogsArr(logs)
				console.log('setLogsArr', logsArr)
			})
	}, [ids])
	
	const columns = useMemo(
		() => [
			{
				id: 'selection',
				canSortBy: true,
				accessor: obj => obj.invalid_accessor_for_sorting, // undef. needs to be set to any value for sorting
				sortType: (rowA, rowB, columnId: String, desc: Boolean) => {
					return rowB.isSelected - rowA.isSelected
				},
				Header: ({getToggleAllRowsSelectedProps}) =>
					<>
						<IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
					</>,
				Cell: ({row}) =>
					<>
						<IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
					</>,
			},
			{
				Header: 'title',
				accessor: log => log.info.title,
				id: 'title',
				className: 'has-text-left',
			},
			{
				Header: 'map',
				accessor: log => log.info.map,
				id: 'map',
				className: 'has-text-left',
			},
			{
				Header: 'players',
				accessor: log => log.players,
				id: 'players',
				className: 'has-text-left',
				Cell: ({value}) => Object.keys(value).length,
			},
			{
				Header: 'date',
				accessor: log => log.info.date,
				id: 'date',
				Cell: ({value}) => <Date date={value}/>,
				className: 'has-text-left',
			},
			...[
				'kills',
				'deaths',
				'assists',
				'suicides',
				'kapd',
				'kpd',
				'dmg',
				'dmg_real',
				'dt',
				'dt_real',
				'hr',
				'lks',
				'as',
				'dapd',
				'dapm',
				'drops',
				'medkits',
				'medkits_hp',
				'backstabs',
				'headshots',
				'headshots_hit',
				'sentries',
				'heal',
				'cpc',
				'ic',
			].map(i => numberCell(steam32, i)),
		], [steam32])
	
	return <MainTable data={logsArr} columns={columns} steam64={steam64}/>
}