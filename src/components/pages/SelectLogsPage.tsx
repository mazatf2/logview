import React from 'react'
import {SearchLogListApi} from '../SearchLogListApi'
import {LogListTable} from '../loglisttable/LoglistTable'

export const SelectLogsPage = ({togglePages, handleSubmit, tableData, steam64}) => {
	return <div className="section">
		<div className="container">
			<SearchLogListApi onSubmit={handleSubmit}/>
			<LogListTable
				togglePages={togglePages}
				tableData={tableData}
				steam64={steam64}
			/>
		</div>
	</div>
}