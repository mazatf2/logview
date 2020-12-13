import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom'
import SteamID from 'steamid'
import {fetchLogList} from './fetch'
import {logListJson, searchLogListApi, searchLogListOpts} from './logstf_api'
import {
	isValidSteamId,
	isValidSteamIdList,
	parseSteamId,
	parseSteamIdList,
	searchObj,
} from './components/searchforms/SearchLogListApiFormAdvanced'
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom'
import {SelectLogsPage} from './components/pages/SelectLogsPage'
import {DevPage} from './components/pages/DevPage'
import {LogCombinerPage} from './components/pages/LogCombinerPage'
import {SelectLogsPageNavigation} from './components/pages/SelectLogsPageNavigation'
import {LogStats} from './components/pages/LogStats'
import {NavBar} from './components/NavBar'

export interface logListTableData {
	log: logListJson,
}

const newLogListTableDataEntry = (i: logListJson): logListTableData => {
	return {
		log: i,
	}
}

let mainData: logListTableData[] = []

const App = () => {
	const [steam64, setSteam64] = useState<string>('76561197996199110')
	const [logListTableData, setLogListTableData] = useState<logListTableData[]>([])
	const [showSelectPage, setShowSelect] = useState(false)
	
	const id = new SteamID(steam64)
	const steam32 = id.getSteam3RenderedID()
	
	const searchTeamp = async (obj: Partial<searchLogListOpts>) => {
		const t = await fetchLogList(obj)
		const data: searchLogListApi = await t.json()
		
		mainData = data.logs.map(i => newLogListTableDataEntry(i))
		setLogListTableData(mainData)
		setSteam64(obj.player[0])
		console.log(data)
	}
	
	const handleSubmit = (i: searchObj) => {
		
		const noDuplicates = (i) => Array.from(new Set([...i])).join(',')
		
		if (i.formType === 'simple' && i.player) {
			const isIdList = isValidSteamIdList(i.player)
			if (isIdList) {
				const ids = parseSteamIdList(i.player)
					.filter(i => i)
					.map(i => i.getSteamID64())
				
				const temp = noDuplicates(ids)
				searchTeamp({player: [temp]})
				
			}
		}
		
		if (i.formType === 'advanced') {
			
			const checkPlayer = (list: string) => {
				if (list && isValidSteamIdList(list)) {
					return noDuplicates(parseSteamIdList(list).map(id => id.getSteamID64()))
				}
				return null
			}
			
			const query: searchObj = {
				formType: 'advanced',
				map: (i.map.length < 64 && i.map) || '',
				title: (i.title.length < 64 && i.map) || '',
				player: checkPlayer(i.player) || '',
				uploader: (i.uploader && isValidSteamId(i.uploader) && parseSteamId(i.uploader).getSteamID64()) || '',
				
			}
			searchTeamp(query)
			
		}
	}
	
	const togglePages = (page?: string) => {
		console.log('togglePages')
		
		if (page && page.includes('select')) {
			if (!showSelectPage) {
				setShowSelect(true)
				console.log('show select')
			}
			
		} else {
			if (showSelectPage) {
				setShowSelect(false)
				console.log('hide select')
			}
		}
		
	}
	
	useEffect(() => {
		togglePages(location.pathname)
	}, [])
	
	const isSelectPageActive = () => {
		if (showSelectPage)
			return 'block'
		return 'none'
	}
	
	return <Router basename="/logview">
		<NavBar/>
		<Switch>
			<Route path="/log-stats/:steam64/:ids">
				<LogStats/>
			</Route>
			<Route path="/select">
				<SelectLogsPageNavigation onLocationPage={togglePages}/>
			</Route>
			<Route path="/log-combiner/:idList">
				<LogCombinerPage/>
			</Route>
			<Route exact path="/">
				<Redirect to="/select"/>
			</Route>
			<Route path="*">
				<Redirect to="/select"/>
			</Route>
		</Switch>
		<div style={{display: isSelectPageActive()}}>
			<SelectLogsPage
				togglePages={togglePages}
				handleSubmit={handleSubmit}
				tableData={logListTableData}
				steam64={steam64}
			/>
		</div>
	</Router>
}

ReactDOM.render(<App/>, document.getElementById('root'))