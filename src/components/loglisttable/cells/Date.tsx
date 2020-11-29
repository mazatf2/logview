import React, {useMemo} from 'react'
import dayjs from 'dayjs'

export const Date = ({date}: { date: number }) => {
	const obj = useMemo(() => dayjs.unix(date).format('MMM D, YYYY h:mm A'), [date])
	return <>
		{obj}
	</>
}