import React from 'react'
import {useForm} from 'react-hook-form'
import Steamid from 'steamid'
import {Input} from './components/Input'
import {Button} from './components/Button'
import {Label} from './components/Label'
import {FieldHorizontal} from './components/FieldHorizontal'
import {FieldBody} from './components/FieldBody'
import {PlayerSelect} from './rows/PlayerSelect'
import {Form} from './components/Form'
import {FormType} from './components/FormType'

export const parseSteamId = (val: string) => {
	if (val === undefined) return null
	if (val === '') return null
	
	try {
		const str = val.trim()
		
		const id = new Steamid(str)
		if (id.isValid())
			return id
		
		return null
	} catch (e) {
		return null
	}
}

export const parseSteamIdList = (val: string) => {
	if (val === undefined) return []
	if (val === '') return []
	
	try {
		const str = val.trim()
		const list = str.split(',')
		
		return list.map(i => parseSteamId(i))
	} catch (e) {
		return []
	}
}

export const isValidSteamId = (val: string) => {
	if (val === undefined) return false
	if (val === '') return false
	
	try {
		const str = val.trim()
		
		const id = new Steamid(str)
		return id.isValid()
		
	} catch (e) {
		return false
	}
}

export const isValidSteamIdList = (val: string) => {
	if (val === undefined) return false
	if (val === '') return false
	
	try {
		const str = val.trim()
		const list = str.split(',')
		
		return list.every(i => isValidSteamId(i))
	} catch (e) {
		return false
	}
}

export const isEmptyOrValidSteamIdField = (val: string) => {
	if (val === undefined) return true
	if (val === '') return true
	
	try {
		const str = val.trim()
		
		const id = new Steamid(str)
		return id.isValid()
		
	} catch (e) {
		return false
	}
}

export const isEmptyOrValidSteamIdListField = (val: string) => {
	if (val === undefined) return true
	if (val === '') return true
	
	try {
		const str = val.trim()
		const list = str.split(',')
		
		return list.every(i => isValidSteamId(i))
	} catch (e) {
		return false
	}
}

export type searchObj = {
	title: string,
	map: string,
	uploader: string,
	player: string
	formType: 'simple' | 'advanced'
}

export const SearchLogListApiFormAdvanced = ({onSubmit, ...props}: { onSubmit: searchObj }) => {
	const {handleSubmit, register, errors} = useForm()
	
	return (
		<Form
			onSubmit={handleSubmit(onSubmit)}
		>
			<FieldHorizontal>
				<Label>Title</Label>
				<Input
					name="title"
					minLength={3}
					register={register({})}
					placeholder="i52 - BLU vs RED"/>
			</FieldHorizontal>
			
			<FieldHorizontal>
				<Label>Map</Label>
				<Input
					name="map"
					title="exact map name"
					minLength={3}
					register={register({})}
					placeholder="cp_process_final1"/>
			</FieldHorizontal>
			
			<FieldHorizontal>
				<Label>Uploader</Label>
				<Input
					name="uploader"
					title="steam id"
					register={register({
						validate: val => isEmptyOrValidSteamIdField(val),
					})}
					placeholder="76561197960497430"/>
			</FieldHorizontal>
			
			<PlayerSelect register={register({
				validate: val => isEmptyOrValidSteamIdListField(val),
			})}/>
			
			{errors.uploader &&
			<FieldHorizontal>
				<Label></Label>
				<FieldBody>
					{errors.uploader && <p>invalid uploader</p>}
				</FieldBody>
			</FieldHorizontal>
			}
			
			{errors.player &&
			<FieldHorizontal>
				<Label></Label>
				<FieldBody>
					{errors.player && <p>invalid players</p>}
				</FieldBody>
			</FieldHorizontal>
			}
			
			<FieldHorizontal>
				<Label></Label>
				<FieldBody>
					<div className="field is-grouped">
						<Button onClick={handleSubmit(onSubmit)}>Search</Button>
						{props.children}
					</div>
				</FieldBody>
			</FieldHorizontal>
			
			<FormType type={'advanced'} register={register({})}/>
		</Form>
	)
}