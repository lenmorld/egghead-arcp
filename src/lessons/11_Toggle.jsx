/*
	Lesson 11 Custom state reducers
*/

import React from "react";
import { Switch } from "./Switch";

const renderUI = ({ on, toggle }) => {
	return <Switch on={on} onClick={toggle} />;
}

// accepts functions, returns a function that accepts args and calls all functions, one at a time passing the args
const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args))

class Toggle extends React.Component {
	// reset handler is optional, so wwe can add this to defaultProps with a no-op
	static defaultProps = {
		onReset: () => {},
		initialOn: true,
		renderUI,
	}

	initialState = { on: this.props.initialOn } // make this customizable by user
	state = this.initialState

	// create our own setState with the same API as orig setState
	internalSetState(changes, callback) {
		this.setState((currentState) => {
			const changesObject = typeof changes === 'function' ? changes(currentState) : changes;
			// user's custom logic to modify state
			const reducedChanges = this.props.stateReducer(currentState, changesObject);
			return reducedChanges;
		}, callback)
		// this.props.stateReducer
	}

	toggle = () =>
		// this.setState(
		this.internalSetState(
			({ on }) => ({ on: !on }),
			() => {
				this.props.onToggle(this.state.on); // call custom from user
			}
		);

	reset = () =>
		// this.setState(this.initialState, () => {
		this.internalSetState(this.initialState, () => {
			this.props.onReset(this.state.on)	// call custom from user
		})

	getStateAndHelpers() {
		return {
			on: this.state.on,
			toggle: this.toggle,
			reset: this.reset,
			getTogglerProps: this.getTogglerProps,
		}
	}

	getTogglerProps = ({onClick, className, ...props}) => {
		return {
			...props,
			onClick: callAll(onClick, this.toggle),
			className: `${className} our-class-name`,
			'aria-pressed': this.state.on,
		}
	}

	render() {
		return this.props.children(this.getStateAndHelpers());
	}
}


class Usage extends React.Component {
	static defaultProps = {
	  onToggle: (...args) => console.log('onToggle', ...args),
	  onReset: (...args) => console.log('onReset', ...args),
	}
	initialState = {timesClicked: 0}
	state = this.initialState
	handleToggle = (...args) => {
	  this.setState(({timesClicked}) => ({
		timesClicked: timesClicked + 1,
	  }))
	  this.props.onToggle(...args)
	}
	handleReset = (...args) => {
	  this.setState(this.initialState)
	  this.props.onReset(...args)
	}

	// before we call setState in the Toggle component, 
	// the consumer has a chance to modify the state we're about to set. 
	toggleStateReducer = (state, changes) => {
	  if (this.state.timesClicked >= 4) {
		return {...changes, on: false}
	  }
	  return changes
	}
	render() {
	  const {timesClicked} = this.state
	  return (
		<Toggle
		  stateReducer={this.toggleStateReducer}
		  onToggle={this.handleToggle}
		  onReset={this.handleReset}
		>
		  {toggle => (
			<div>
			  <Switch
				{...toggle.getTogglerProps({
				  on: toggle.on,
				})}
			  />
			  {timesClicked > 4 ? (
				<div data-testid="notice">
				  Whoa, you clicked too much!
				  <br />
				</div>
			  ) : timesClicked > 0 ? (
				<div data-testid="click-count">
				  Click count: {timesClicked}
				</div>
			  ) : null}
			  <button onClick={toggle.reset}>Reset</button>
			</div>
		  )}
		</Toggle>
	  )
	}
  }


export default Usage;