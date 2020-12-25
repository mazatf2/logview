import React from 'react'
import {logstf_json_player_keys, logstf_json_player_medicstats_obj, logstfJson} from '../../logstf_api'
import {Abbr, AbbrMedicStats} from './Abbr'
import './CombineLogs.css'

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
	
	const indexByKey: Record<string, string> = obj => obj
		.map(i => Object.entries(i))
		.flat()
		.reduce((collector, i) => {
			if (collector[i[0]])
				return {...collector, [i[0]]: collector[i[0]].concat(i[1])}
			return {...collector, [i[0]]: [i[1]]}
		}, {})
	
	
	const getName = (steam32: string) => names[steam32] || steam32
	
	const merge = (i) => {
		for (const [id, medic] of i) {
			medics[id] = medics[id] || {}
			
			Object.keys(medic).forEach(key => {
				medics[id][key] = medics[id][key] || []
				medics[id][key].push(medic[key])
			})
		}
	}
	
	logs.forEach(log => {
		const medics = Object.entries(log.players)
			.filter(([id, player]) => {
				const isMedic = player.class_stats.find(i => i.type === 'medic')
				if (isMedic)
					return [id, player.class_stats.find(i => i.type === 'medic')]
			})
			.map(([id, player]) => {
				player.healspread = log.healspread[id] || {}
				return [id, player]
			})
		
		merge(medics)
	})
	
	const sum = (arr: []) => arr.reduce((collector: number, i: string) => collector + parseFloat(i), 0)
	
	const avg = (arr: []) => {
		if (arr.length > 0)
			return sum(arr) / arr.length
		
		return arr[0] || 0
	}
	
	const view = ({
					  obj,
					  key,
					  valueConcatFn = sum,
					  decimals = 0,
					  abbrType = 'normal',
					  showRawKey: showRawAbbrKey = false,
				  }) => {
		
		const val = obj[key] || []
		const concatVal = valueConcatFn(val)
		const valRound = Number(concatVal).toFixed(decimals)
		
		let abbr
		if (showRawAbbrKey) {
			let temp = [...key]
			temp[0] = temp[0] && temp[0].toUpperCase() || ''
			abbr = temp.join('') || ''
		} else {
			if (abbrType === 'normal')
				abbr = Abbr(key)
			if (abbrType === 'medicstats')
				abbr = AbbrMedicStats(key)
		}
		
		return <tr>
			<th className="th noBold">{abbr}</th>
			<td className="td has-text-right">{valRound}</td>
		</tr>
	}
	const mapUberTypes = (i) => {
		const uberTypes = indexByKey(i.ubertypes)
		const mediguns = Object.keys(uberTypes)
		return mediguns.map(medigun => view({obj: uberTypes, key: medigun, showRawKey: true}))
	}
	
	const mapMedicStats = (i) => {
		const medicStats = indexByKey(i.medicstats)
		return [
			view({
				obj: medicStats,
				key: logstf_json_player_medicstats_obj.avg_time_to_build,
				valueConcatFn: avg,
				decimals: 1,
				abbrType: 'medicstats',
			}),
			view({
				obj: medicStats,
				key: logstf_json_player_medicstats_obj.avg_time_before_using,
				valueConcatFn: avg,
				decimals: 1,
				abbrType: 'medicstats',
			}),
			view({
				obj: medicStats,
				key: logstf_json_player_medicstats_obj.avg_uber_length,
				valueConcatFn: avg,
				decimals: 1,
				abbrType: 'medicstats',
			}),
			view({
				obj: medicStats,
				key: logstf_json_player_medicstats_obj.deaths_with_95_99_uber,
				abbrType: 'medicstats',
			}),
			view({
				obj: medicStats,
				key: logstf_json_player_medicstats_obj.deaths_within_20s_after_uber,
				abbrType: 'medicstats',
			}),
			view({
				obj: medicStats,
				key: logstf_json_player_medicstats_obj.advantages_lost,
				abbrType: 'medicstats',
			}),
			view({
				obj: medicStats,
				key: logstf_json_player_medicstats_obj.biggest_advantage_lost,
				abbrType: 'medicstats',
			}),
		]
	}
	
	const mapHealSpread = (i, medicId) => {
		const healSpread = indexByKey(i.healspread)
		
		class Spread {
			public name: string
			public amount: number
			public percentage: string
			
			constructor(targetId: string, amount: number[], medic) {
				this.name = getName(targetId)
				this.amount = sum(amount)
				this.percentage = Math.round((this.amount / sum(medic.heal)) * 100) + ''
			}
			
			val() {
				return this.amount
			}
			
			render() {
				return <tr>
					<th className="th noBold">{this.name}</th>
					<td className="td has-text-right">{this.amount}</td>
					<td className="td has-text-right">{this.percentage}%</td>
				</tr>
			}
		}
		
		const temp = Object.entries(healSpread).map(([targetId, amount]) => new Spread(targetId, amount, i))
			.sort((a, b) => a.val() - b.val())
			.reverse()
		
		return temp.map(i => i.render())
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
						{view({obj: i, key: 'heal'})}
						{view({obj: i, key: 'drops'})}
						{mapMedicStats(i)}
						<tr>
							<th className="th">Heal spread</th>
							<th className="th has-text-right">Total</th>
							<th className="th has-text-right">%</th>
						</tr>
						{mapHealSpread(i, id)}
						<tr>
							<th className="th" colSpan={2}>Charges</th>
						</tr>
						{mapUberTypes(i)}
						</tbody>
					</table>
				</div>,
			)}
	</div>
	
}