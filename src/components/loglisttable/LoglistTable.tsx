import React, {useMemo} from 'react'
import {logListTableData} from '../../Index'
import {IndeterminateCheckbox, MainTable} from './MainTable'
import {Date} from './cells/Date'
import {Id} from './cells/Id'

export type LogListTableProps = {
	tableData: logListTableData[]
	steam64: string
	togglePages: (page?: string) => void
}

export const LogListTable = ({tableData, steam64, togglePages}: LogListTableProps) => {
	const columns = useMemo(() => [
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
			Header: 'id',
			accessor: 'log.id',
			className: 'has-text-right',
			Cell: ({value}) => <Id id={value}/>,
		},
		{
			Header: 'title',
			accessor: 'log.title',
			className: 'has-text-left',
		},
		{
			Header: 'map',
			accessor: 'log.map',
			className: 'has-text-left',
		},
		{
			Header: 'players',
			accessor: 'log.players',
			className: 'has-text-right',
		},
		{
			Header: 'date',
			accessor: 'log.date',
			className: 'has-text-left',
			Cell: ({value}) => <Date date={value}/>,
		},
		{
			Header: 'views',
			accessor: 'log.views',
			className: 'has-text-right',
		},
	
	], [tableData])
	
	return <MainTable data={tableData} columns={columns} steam64={steam64} togglePages={togglePages}/>
}