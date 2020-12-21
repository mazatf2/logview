import React from 'react'
import {logstf_json_player_keys, logstfJson} from '../../logstf_api'
import {Abbr} from './Abbr'

type props = {
	logsArr: logstfJson[]
	ids: number[]
}
export const MedicStats = ({logsArr, ids}: props) => {
	if (!logsArr) return <>Loading</>
	
	if (logsArr.length === 0)
		return <></>
	
	const deepCopy = (i: logstfJson[]) => JSON.parse(JSON.stringify(i))
	const logs: logstfJson[] = deepCopy(logsArr)
		.reverse()
	let medics: Record<string, { [key: string]: typeof logstf_json_player_keys[] }> = {}
	
	const names: Record<string, string> = logs.map(i => Object.entries(i.names))
		.flat()
		.reduce((collector, i) => {
			return {...collector, [i[0]]: i[1]}
		}, {})
	
	const getName = (steam32: string) => names[steam32] || steam32
	
	const merge = (i) => {
		for (const [id, medic] of i) {
			medics[id] = medics[id] || {}
			
			logstf_json_player_keys.forEach(key => {
				medics[id][key] = medics[id][key] || []
				medics[id][key].push(medic[key])
			})
		}
	}
	
	logs.forEach(log => {
		const medics = Object.entries(log.players)
			.filter(([id, player]) => player.class_stats.find(i => i.type === 'medic'))
		
		merge(medics)
	})
	
	const view = (i, key) => {
		const val = i[key].reduce((collector: number, i: string) =>
			collector + parseFloat(i)
			, 0)
		
		return <tr>
			<th className="th">{Abbr(key)}</th>
			<td className="td">{val}</td>
		</tr>
	}
	
	return <div className="columns">
		{
			Object.entries(medics).map(([id, i]) =>
				<div className="column" key={id}>
					<table className={'table is-hoverable'}>
						<thead className="thead">
						<tr className="tr">
							<th className="th" colSpan={2}>{getName(id)}</th>
						</tr>
						</thead>
						<tbody className="tbody">
						{view(i, 'heal')}
						{view(i, 'ubers')}
						{view(i, 'drops')}
						</tbody>
					</table>
				</div>,
			)}
	</div>
	
}