import React, {forwardRef, useMemo} from 'react'
import {useAsyncDebounce, useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable} from 'react-table'
import {FieldHorizontal} from '../searchforms/components/FieldHorizontal'
import {Label} from '../searchforms/components/Label'
import {FieldBody} from '../searchforms/components/FieldBody'
import {logListTableData} from '../../Index'
import './MainTable.css'
import {Link} from 'react-router-dom'
import {Button} from '../searchforms/components/Button'

export const IndeterminateCheckbox = forwardRef(({indeterminate, ...rest}, ref) => {
		// https://github.com/tannerlinsley/react-table/blob/v7.6.1/examples/row-selection/src/App.js#L36
		const defaultRef = React.useRef()
		const resolvedRef = ref || defaultRef
		
		React.useEffect(() => {
			resolvedRef.current.indeterminate = indeterminate
		}, [resolvedRef, indeterminate])
		
		return (
			<>
				<input
					type="checkbox"
					ref={resolvedRef}
					{...rest}
					className="checkbox"
				/>
			</>
		)
	},
)

function GlobalFilter({preGlobalFilteredRows, globalFilter, setGlobalFilter}) {
	// https://github.com/tannerlinsley/react-table/blob/v7.6.1/examples/filtering/src/App.js#L39
	const count = preGlobalFilteredRows.length
	const [value, setValue] = React.useState(globalFilter)
	const onChange = useAsyncDebounce(value => {
		setGlobalFilter(value || undefined)
	}, 200)
	
	return (
		<FieldHorizontal>
			<Label>Filter</Label>
			<FieldBody>
				<div className="field is-narrow">
					<div className="control">
						<input
							value={value || ''}
							onChange={e => {
								setValue(e.target.value)
								onChange(e.target.value)
							}}
							placeholder={`${count} logs...`}
							className="input"
						/>
					</div>
				</div>
			</FieldBody>
		</FieldHorizontal>
	)
}

export type MainTableProps = {
	data: logListTableData[]
	columns: []
	steam64: string
	togglePages?: (page?: string) => void
}

export const MainTable = ({data, columns, steam64, togglePages}: MainTableProps) => {
	const columnsMemo = useMemo(() => columns, [columns])
	const dataMemo = useMemo(() => data, [data])
	
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		page,
		setPageSize,
		prepareRow,
		selectedFlatRows,
		preGlobalFilteredRows,
		setGlobalFilter,
		state: {pageIndex, pageSize, globalFilter},
	} = useTable({
			columns: columnsMemo,
			data: dataMemo,
			disableSortRemove: true,
			initialState: {pageSize: 80},
		},
		useGlobalFilter,
		useSortBy,
		usePagination,
		useRowSelect,
	)
	
	const setBold = (i: boolean) => {
		if (i) return ''
		return 'noBold'
	}
	
	return (
		<div
			className="is-fullwidth is-fullheight"
			style={{overflow: 'auto'}}
		>
			<div className="container">
				{console.log(selectedFlatRows)}
				<GlobalFilter
					preGlobalFilteredRows={preGlobalFilteredRows}
					globalFilter={globalFilter}
					setGlobalFilter={setGlobalFilter}
				/>
				
				{togglePages &&
				<FieldHorizontal>
					<Label></Label>
					<FieldBody>
						<div className="field is-grouped">
							<Link to={'/log-combiner/' + selectedFlatRows.map(i => i.original.log.id)}
								onClick={() => togglePages('')}
								className="button control"
							>
								Log Combiner
							</Link>
							<Link to={`/log-stats/${steam64}/` + selectedFlatRows.map(i => i.original.log.id)}
								onClick={() => togglePages('')}
								className="button control"
							>
								Log Stats
							</Link>
						</div>
					</FieldBody>
				</FieldHorizontal>
				}
				
				<table className="table is narrow is-hoverable" {...getTableProps()}>
					<thead className="thead">
					{headerGroups.map(headerGroup => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map(column => (
								<th
									{...column.getHeaderProps([
										column.getSortByToggleProps(),
										{
											className: `th ${column.className || ''} ${setBold(column.isSorted)}`,
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
					{page.map(row => {
						prepareRow(row)
						
						return (
							<tr className="tr" {...row.getRowProps()}>
								{row.cells.map(cell => {
									
									return (
										<td
											{...cell.getCellProps([
												{
													className: `td ${cell.column.className || ''}`,
												},
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
				
				{data.length > 80 &&
				<FieldHorizontal>
					<Label>Showing {pageSize} logs</Label>
					<FieldBody>
						<div className="field is-grouped">
							<Button
								onClick={() => setPageSize(80)}
							>
								Show 80
							</Button>
							<Button
								onClick={() => setPageSize(data.length)}
							>
								Show all
							</Button>
						</div>
					</FieldBody>
				</FieldHorizontal>
				}
			
			</div>
		</div>
	)
}