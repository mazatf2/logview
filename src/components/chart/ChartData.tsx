class ChartData {
	
	addTimeStamps(data: any[], timestamp: number) {
		let oldDate = new Date(data[0].date_json).getTime()
		
		for (let i = 0; i < data.length; i++) {
			const now = new Date(data[i].date_json).getTime()
			
			if (now - oldDate < timestamp) {
			} else {
				data.splice(i, 0, {type: 'timestamp', date_json: oldDate + timestamp})
				i = i - 1
				oldDate = oldDate + timestamp
			}
		}
		
		return data
	}
	
	prepareEvents(data: any, timeStampResolution: number) {
		const events = Object.values(data.events)
		const timeStamped = this.addTimeStamps(events, timeStampResolution)
		
		const add = (team: string, dmg: number, date: any, id: number) => {
			return {
				player_team: team,
				damage: dmg,
				date_json: date,
				id: id,
			}
		}
		
		let red = 0
		let blue = 0
		const storage = []
		let id = 0
		
		for (const ev of events) {
			if (ev.type !== 'timestamp') {
				if (ev.type === 'damage_trigger') {
					if (ev.player_team === 'Red') red += Number(ev.damage)
					if (ev.player_team === 'Blue') blue += Number(ev.damage)
				}
				
			} else {
				storage.push(add('Red', red, ev.date_json, id))
				storage.push(add('Blue', blue, ev.date_json, id))
				
				id += 1
				red = 0
				blue = 0
			}
		}
		
		console.log(id, storage)
		console.log('parsed events', events.filter(i => i.type === 'damage_trigger').length)
		
		
		const result = events
			.filter(i => i.type === 'damage_trigger')
			.map(i => {
				if (i.play_state === 'pregame') {
					return {
						player_team: i.player_team,
						damage: 0,
						date_json: i.date_json,
						tick_from_tournament_start: i.tick_from_tournament_start,
						id: i.id,
					}
				}
				
				return {
					player_team: i.player_team,
					damage: i.damage,
					date_json: i.date_json,
					tick_from_tournament_start: i.tick_from_tournament_start,
					id: i.id,
				}
			})
		
		return result
	}
}