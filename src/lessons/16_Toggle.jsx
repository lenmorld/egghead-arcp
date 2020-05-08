/*
	Lesson 16 Improve the usability of Control Props with state change types
*/

import React from "react";
import { Switch } from "./Switch";

class Toggle extends React.Component {
	static defaultProps = {
		onToggle: () => {},
		onStateChange: () => {},
	}

	static stateChangeTypes = {
		toggleOn: '__toggle_on__',
		toggleOff: '__toggle_off__',
		toggle: '__toggle__',
	}

	state = {on: false}

	// controlled if a prop is passed
	isControlled (prop) {
		return this.props[prop] !== undefined
	} 

	getState(state = this.state) {
		// create an object as a combination of prop value if controlled
		// and the shallow-copy of state if not
		return Object.entries(state).reduce((combinedState, [key, value]) => {
			if (this.isControlled(key)) {
				combinedState[key] = this.props[key]
			} else {
				combinedState[key] = value
			}

			return combinedState
		}, {})
	}

	internalSetState(changes, callback) {
		let allChanges

		// changes are either object representing changes to be done
		// or a state updater function
		this.setState(state => {
			// state updater function

			const combinedState = this.getState(state)
			const changesObject = typeof changes === 'function' ? changes(combinedState) : changes

			allChanges = changesObject
			const {type: ignoredType, ...onlyChanges} = changesObject

			const nonControlledChanges = Object.entries(onlyChanges).reduce((newChanges, [key, value]) => {
				if (!this.isControlled(key)) {
					newChanges[key] = value
				}

				return newChanges
			}, {})

			return Object.keys(nonControlledChanges).length ? nonControlledChanges : null
		}, () => {
			// this.props.onStateChange(this.getState())
			this.props.onStateChange(allChanges, this.getState())
			callback
		})
	}


	toggle = ({ on: newState, type} ={}) => {
		this.internalSetState(
			({on}) => ({
				on: typeof newState === 'boolean' ? newState : !on,
				type
			}),
			() => {
				this.props.onToggle(this.getState().on)
			}
		)
	}
	
	// new methods
	handleSwitchClick = () => this.toggle({ type: Toggle.stateChangeTypes.toggle })
	handleOffClick = () => this.toggle({on: false, type: Toggle.stateChangeTypes.toggleOff})
	handleOnClick = () => this.toggle({on: true, type: Toggle.stateChangeTypes.toggleOn})

	render() {
		// return <Switch on={this.getState().on} onClick={this.toggle} />

		return (
			<div>
				<Switch 
					on={this.getState().on}
					onClick={this.handleSwitchClick}
				/>
				<button onClick={this.handleOffClick}>off</button>
				<button onClick={this.handleOnClick}>on</button>
			</div>
		)
	}
}


class Usage extends React.Component {
	state = {bothOn: false, snowflake: false}

	// handleToggle = on => {
	//   this.setState({bothOn: on})
	// }

	// USE CASE 1:
	// handleStateChange = (changes) => {
	// 	if (changes.type === 'toggle-on' || changes.type === 'toggle-off') {
	// 		return
	// 	}
	// 	this.setState({bothOn: changes.on})
	// }

	// USE CASE 2:
	lastWasButton = false
	handleStateChange = (changes) => {
		const isButtonChange = 
			// changes.type === 'toggle-on' || changes.type === 'toggle-off'
			changes.type === Toggle.stateChangeTypes.toggleOn || changes.type === Toggle.stateChangeTypes.toggleOff

		if ((this.lastWasButton && isButtonChange) || changes.type === Toggle.stateChangeTypes.toggle) {
			this.setState({bothOn: changes.on})
			this.lastWasButton = false
		} else  {
			this.lastWasButton = isButtonChange
		}
	}

	handleToggle2 = on => {
		this.setState({snowflake: on})
	  }
	render() {
	  const {bothOn} = this.state
	  return (
		<div>
		  <Toggle
			on={bothOn}
			onStateChange={this.handleStateChange}
		  />
		  <Toggle
			on={bothOn}
			onStateChange={this.handleStateChange}
		  />
		{/* no on Prop, toggles the others, but others cannot toggle it */}
		{/* <Toggle
			onStateChange={this.handleStateChange}
		  /> */}

		{/* completely separate change handler 
			but kind of useless since Toggle already has its own state
		*/}
		{/* <Toggle
			on={this.state.snowflake}
			onStateChange={this.handleToggle2}
		  /> */}
		</div>
	  )
	}
  }


export default Usage;
