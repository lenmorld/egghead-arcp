/*
	Lesson 10 Use Component State initializers
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

	// state = { on: false }; // DRY this up as initialState
	// initialState = { on: false}
	initialState = { on: this.props.initialOn } // make this customizable by user
	state = this.initialState

	toggle = () =>
		this.setState(
			({ on }) => ({ on: !on }),
			() => {
				this.props.onToggle(this.state.on); // call custom from user
			}
		);

	reset = () =>
		this.setState(this.initialState, () => {
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

function onButtonClick() {
	console.log("waa");
}

// initial props go here
function Usage({
	initialOn=  false, // provide custom initial state
	onToggle = (...args) => console.log("onToggle", ...args),
	onReset = (...args) => { console.log("onReset", ...args) }, // provide custom reset function
	name = "Benny"
}) {

	return (
		<Toggle 
			initialOn={initialOn}
			onToggle={onToggle}
			onReset={onReset}
			>
			{({on, getTogglerProps, reset}) => (
				<div>
					<Switch {...getTogglerProps({on})} />
					<hr />
					<button onClick={reset}>Reset</button>
				</div>
			)}
		</Toggle>
	)
	// return (
	// 	<Toggle onToggle={onToggle}>
	// 		{({ on, getTogglerProps }) => (
	// 			<div>
	// 				{on ? 'The button is on' : 'The button is off'}
	// 				<Switch {...getTogglerProps({on})} />
	// 				<hr />
	// 				<button 
	// 					{...getTogglerProps({
	// 						'aria-label':"custom-button",
	// 						'aria-pressed': null,
	// 						id:"custom-button-id",
	// 						className: "custom-class",
	// 						onClick:onButtonClick
	// 					})}
	// 					>
	// 					{on ? 'on' : 'off'}
	// 				</button>
	// 			</div>
	// 		)}
	// 	</Toggle>
	// )
}

export default Usage;
