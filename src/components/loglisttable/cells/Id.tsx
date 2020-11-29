import React, {useMemo} from 'react'

export const Id = ({id}: { id: number }) => {
	return <a
		href={'https://logs.tf/' + id}>
		{id}
	</a>
}