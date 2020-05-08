/*
	Lesson 15 state change handler for all control props
*/

import React from "react";
import { Switch } from "./Switch";

class Toggle extends React.Component {
	static defaultProps = {
		onToggle: () => {},
		onStateChange: () => {},
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
			const nonControlledChanges = Object.entries(changesObject).reduce((newChanges, [key, value]) => {
				if (!this.isControlled(key)) {
					newChanges[key] = value
				}

				return newChanges
			}, {})

			return Object.keys(nonControlledChanges).length ? nonControlledChanges : null
		}, () => {
			// this.props.onStateChange(this.getState())
			this.props.onStateChange(allChanges)
			callback
		})
	}


	toggle = () => {
		this.internalSetState(
			({on}) => ({on: !on}),
			() => {
				this.props.onToggle(this.getState().on)
			}
		)
	}
	
	render() {
		// return <Switch on={this.state.on} onClick={this.toggle} />
		// return <Switch on={this.props.on} onClick={this.toggle} />
		return <Switch on={this.getState().on} onClick={this.toggle} />
	}
}


class Usage extends React.Component {
	state = {bothOn: false, snowflake: false}

	// handleToggle = on => {
	//   this.setState({bothOn: on})
	// }

	handleStateChange = ({on}) => {
		this.setState({bothOn: on})
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
		<Toggle
			onStateChange={this.handleStateChange}
		  />

		{/* completely separate change handler 
			but kind of useless since Toggle already has its own state
		*/}
		<Toggle
			on={this.state.snowflake}
			onStateChange={this.handleToggle2}
		  />
		</div>
	  )
	}
  }


export default Usage;
