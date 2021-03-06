import React, {useEffect, useMemo, useState} from 'react'
import {Abbr} from './Abbr'
import ProcessLog from '@bit/mazatf.components.process-log'
import {ClassList} from './cells/ClassList'
import {useSortBy, useTable} from 'react-table'
import {avgDecimals, sumNoDecimals} from './CombineLogs'
import './CombineLogs.css'
import {Name} from './Name'


export const CombineLogsPlayersTable = ({logsArr}) => {
	const [players, setPlayers] = useState([])
	
	useEffect(()=>{
		const temp = async () => {
			const handle = new ProcessLog()
			const promises = logsArr.map(async i => await handle.newLog(i, ''))
			
			Promise.all(promises)
				.then(i => {
					setPlayers(Object.values(handle.db.DB.players))
				})
		}
		
		if(!logsArr || logsArr.length < 1) {
			return
		}
		
		temp()
	}, [logsArr])
	
	const sumColumn = (key: string) => {
		return {
			Header: Abbr(key),
			id: key,
			accessor: player => sumNoDecimals(player[key]),
			className: 'has-text-right',
		}
	}
	
	const medianColumn = (key: string, decimals: number) => {
		return {
			Header: Abbr(key),
			id: key,
			accessor: player => avgDecimals(player[key], decimals),
			className: 'has-text-right',
		}
	}
	
	const columns = React.useMemo(
		() => [
			{
				Header: 'Name',
				accessor: 'currentTeam',
				id: 'currentName',
				className: 'has-text-left',
				Cell: i => <Name player={i.row.original}/>,
			},
			{
				Header: 'Classes',
				accessor: 'mostPlayedClass', // sort key
				id: 'class_stats',
				className: 'has-text-left',
				Cell: i => <ClassList player={i.row.original}/>,
			},
			sumColumn('kills'),
			sumColumn('assists'),
			sumColumn('deaths'),
			sumColumn('dmg'),
			medianColumn('dapm', 0), // dps
			// sumColumn('dapd'), // dmg per death
			medianColumn('kpd', 1), // kd
			sumColumn('as'),
			sumColumn('backstabs'),
			sumColumn('headshots'), // vs headshots_hit
			sumColumn('headshots_hit'), // vs headshots_hit
			sumColumn('cpc'), // captures
		],
		[],
	)
	
	const data = useMemo(() => players, [players])
	
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
	} = useTable({
		columns: columns,
		data: data,
		disableSortRemove: true,
	}, useSortBy)
	
	const getCellProps = (cell) => {
		
		if (['currentName'].includes(cell.column.id)) {
			const team = cell.row.original.currentTeam
			let className
			
			if (team === 'Red')
				className = 'red'
			if (team === 'Blue')
				className = 'blu'
			
			return {
				className: className,
			}
			
		}
		return {}
	}
	
	const setBold = (i: boolean) => {
		if (i) return ''
		return 'noBold'
	}
	
	return <table className="table is-hoverable" {...getTableProps()}>
		<thead className="thead">
		{headerGroups.map(headerGroup => (
			<tr {...headerGroup.getHeaderGroupProps()}>
				{headerGroup.headers.map(column => (
					<th
						{...column.getHeaderProps([
							column.getSortByToggleProps(),
							{
								className: `th ${column.className} ${setBold(column.isSorted)}`,
							},
						])}
					>
						{column.render('Header')}
					</th>
				))}
			</tr>
		))}
		</thead>
		<tbody className="tbody" {...getTableBodyProps()}>
		{rows.map(row => {
			prepareRow(row)
			return (
				<tr className="tr" {...row.getRowProps()}>
					{row.cells.map(cell => {
						return (
							<td
								{...cell.getCellProps([
									{
										className: 'td ' + cell.column.className,
									},
									getCellProps(cell),
								
								])}
							>
								{cell.render('Cell')}
							</td>
						)
					})}
				</tr>
			)
		})}
		</tbody>
	</table>
}
