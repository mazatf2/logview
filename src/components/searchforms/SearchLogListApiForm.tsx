import React from 'react'
import {useForm} from 'react-hook-form'
import {FieldHorizontal} from './components/FieldHorizontal'
import {Label} from './components/Label'
import {FieldBody} from './components/FieldBody'
import {Button} from './components/Button'
import {isValidSteamIdList, searchObj} from './SearchLogListApiFormAdvanced'
import {PlayerSelect} from './rows/PlayerSelect'
import {Form} from './components/Form'
import {FormType} from './components/FormType'

export const SearchLogListApiForm = ({onSubmit, ...props}: { onSubmit: searchObj }) => {
	const {handleSubmit, register, errors} = useForm()
	
	return (
		<Form
			onSubmit={handleSubmit(onSubmit)}
		>
			<PlayerSelect register={register({
				validate: val => isValidSteamIdList(val),
			})}/>
			
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
			
			<FormType type={'simple'} register={register({})}/>
		</Form>
	)
}