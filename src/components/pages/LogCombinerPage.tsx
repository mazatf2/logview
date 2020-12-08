import React from 'react'
import {CombineLogs} from '../combinelogs/CombineLogs'
import {Redirect} from '../../loging'
import {useParams} from 'react-router-dom'

export const LogCombinerPage = () => {
	let {idList} = useParams()
	let list: string[] = []
	
	if (idList && idList.length > 1) {
		try {
			const str = decodeURI(idList).trim()
			const temp = str.split(',')
			
			const onlyNumbers = temp.every(i => Number(i))
			if (!onlyNumbers) return Redirect(['LogCombinerPage onlyNumbers', temp])
			
			temp.map(i => parseInt(i))
				.filter(i => i && i)
				.filter(i => i.toString().length < 10)
			
			if (temp.length > 0) {
				list = temp
			} else {
				return Redirect(['LogCombinerPage idList', idList])
			}
			
			
		} catch (e) {
			return Redirect(['LogCombinerPage idList', idList, e])
		}
	} else {
		return Redirect(['LogCombinerPage idList', idList])
	}
	
	return <div className="section">
		<div className="container">
			<CombineLogs ids={list}/>
		</div>
	</div>
}