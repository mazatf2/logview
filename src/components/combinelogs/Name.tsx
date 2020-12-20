import React from 'react'

export const Name = ({player}) => {
	
	const getTeam = (team: string) => {
		if (team === 'Blue')
			return 'blu'
		if (team === 'Red')
			return 'red'
		return ''
	}
	
	return <a
		href={'https://logs.tf/search/player?s=' + player.steamID}
		className={getTeam(player.currentTeam)}
	>
		{player.currentName}
	</a>
}