/*
	Lesson 14 Support Control props for all state
*/

import React from "react";
import { Switch } from "./Switch";

class Toggle extends React.Component {
	state = {on: false}

	// controlled if a prop is passed
	isControlled (prop) {
		return this.props[prop] !== undefined
	} 

	getState() {
		// prioritize props, fallback to state if props undefined
		// return {
		// 	on: this.isControlled('on') ? this.props.on : this.state.on
		// }

		// create an object as a combination of prop value if controlled
		// and the shallow-copy of state if not
		return Object.entries(this.state).reduce((combinedState, [key, value]) => {
			if (this.isControlled(key)) {
				combinedState[key] = this.props[key]
			} else {
				combinedState[key] = value
			}

			return combinedState
		}, {})
	}

	toggle = () => {
		// if controlled by prop, no need to call setState to save an unneeded re-render
		if (this.isControlled('on')) {
			// flip getState()
			this.props.onToggle(!this.getState().on)
		} else {
			this.setState(
				({on}) => ({on: !on}),
				() => {
					this.props.onToggle(this.getState().on)
				}
			)
		}
	}
	
	render() {
		// return <Switch on={this.state.on} onClick={this.toggle} />
		// return <Switch on={this.props.on} onClick={this.toggle} />
		return <Switch on={this.getState().on} onClick={this.toggle} />
	}
}


class Usage extends React.Component {
	state = {bothOn: false, snowflake: false}

	handleToggle = on => {
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
			onToggle={this.handleToggle}
		  />
		  <Toggle
			on={bothOn}
			onToggle={this.handleToggle}
		  />
		{/* no on Prop, toggles the others, but others cannot toggle it */}
		<Toggle
			onToggle={this.handleToggle}
		  />

		{/* completely separate change handler 
			but kind of useless since Toggle already has its own state
		*/}
		<Toggle
			on={this.state.snowflake}
			onToggle={this.handleToggle2}
		  />
		</div>
	  )
	}
  }


export default Usage;
