import React from 'react'
import {SearchLogListApi} from '../SearchLogListApi'
import {LogListTable} from '../loglisttable/LoglistTable'

export const SelectLogsPage = ({togglePages, handleSubmit, tableData, steam64}) => {
	return <>
		<SearchLogListApi onSubmit={handleSubmit}/>
		
		<div className="section">
			<div className="container">
				<LogListTable
					togglePages={togglePages}
					tableData={tableData}
					steam64={steam64}
				/>
			</div>
		</div>
	</>
}