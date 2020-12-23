import React from 'react'
import {
	logstf_json_player_abbr,
	logstf_json_player_labels,
	logstf_json_player_medicstats_labels,
} from '../../logstf_api'

export const Abbr = (labelId: string) => {
	const long = logstf_json_player_labels[labelId] || ''
	const label = logstf_json_player_abbr[labelId] || ''
	
	return <abbr
		style={{textDecoration: 'none'}}
		title={long}
	>
		{label}
	</abbr>
}

export const AbbrMedicStats = (labelId: string) => {
	const long = logstf_json_player_medicstats_labels[labelId] || ''
	const label = logstf_json_player_medicstats_labels[labelId] || ''
	
	return <abbr
		style={{textDecoration: 'none'}}
		title={long}
	>
		{label}
	</abbr>
}