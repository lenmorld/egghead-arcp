/*
	Lesson 13 Custom state reducers
*/

import React from "react";
import { Switch } from "./Switch";

class Toggle extends React.Component {
	state = {on: false}

	isControlled (prop) {
		return this.props[prop] !== undefined
	} 

	getState() {
		// prioritize props, fallback to state if props undefined
		return {
			on: this.isControlled('on') ? this.props.on : this.state.on
		}
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
	state = {bothOn: false}
	handleToggle = on => {
	  this.setState({bothOn: on})
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
		<Toggle
			onToggle={this.handleToggle}
		  />
		</div>
	  )
	}
  }


export default Usage;
