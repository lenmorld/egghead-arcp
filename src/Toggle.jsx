/*
	Lesson 9 Prop getters with Render props
*/

import React from "react";
import { Switch } from "./Switch";

const renderUI = ({ on, toggle }) => {
	return <Switch on={on} onClick={toggle} />;
}

// accepts functions, returns a function that accepts args and calls all functions, one at a time passing the args
// const callAll = (...fns) => {
// 	return (...args) => {
// 		fns.forEach(fn => fn && fn(...args))
// 	}
// }

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args))


class Toggle extends React.Component {
	static defaultProps = { renderUI }

	state = { on: false };
	toggle = () =>
		this.setState(
			({ on }) => ({ on: !on }),
			() => {
				this.props.onToggle(this.state.on);
			}
		);

	getStateAndHelpers() {
		return {
			on: this.state.on,
			toggle: this.toggle,
			getTogglerProps: this.getTogglerProps,
			// togglerProps: {
			// 	onClick: this.toggle,
			// 	'aria-pressed': this.state.on,
			// }
		}
	}

	getTogglerProps = ({onClick, className, ...props}) => {
		// debugger;
		return {
			...props,
			// onClick: (...args) => {
			// 	onClick && onClick(...args); // custom
			// 	this.toggle() // required for toggler
			// },
			// onClick: (...args) => {
			// 	const fnn = callAll(onClick, this.toggle);
			// 	fnn(...args);
			// },
			onClick: callAll(onClick, this.toggle),
			className: `${className} our-class-name`,
			'aria-pressed': this.state.on,
		}
	}

	render() {
		return this.props.children(this.getStateAndHelpers());
	}
}


/*
	after adding a custom onClick to the <button>, the toggle doesn't work anymore
	since we overrid the togglerProps' onClick with our new custom one

	<button {...togglerProps} onClick={onButtonClick} ...

	solution 1:
	inline the onClick and insert the togglerProps' onClick, so both "use cases" are covered

		onClick={() => {
			onButtonClick();
			togglerProps.onClick();
		}}

	prob: 
		- requires inline function only to express again what was already in the togglerProps
		- exposes the implementation of the togglerProps' abstraction:
			problem if we change togglerProps from onClick to onKeyPress later
			or if we don't need it anymore

			any change to togglerProps results to a *Breaking change* to users

	solution 2:
	with togglerProps, we can't compose the two use cases together without exposing impl. details
	the user of toggleProps doesn't have to know that we're using an onClick and aria-pressed
	they should be able to spread the props we provide them, and everything should be wired correctly
	- provide convenience method for them so they won't have to worry about impl. details

	getTogglerProps(props) function that accepts users' props, then composes those custom props with the props required
	to be a togglerButton, which is the necessary behavior

	perfect also for `className`, so we can combine this component's className
	and the one they pass in props

	<Switch {...getTogglerProps({on})}>


		first try:
			getTogglerProps = (props) => {
				return {
					...props,
					onClick: this.toggle,
					'aria-pressed': this.state.on,
				}
			}

		❌ custom props.onClick is bit being executed

		second try:

			getTogglerProps = ({onClick, ...props}) => {
				return {
					...props,
					onClick: (...args) => {
						onClick(...args); // custom
						this.toggle() // required for toggler
					},
					'aria-pressed': this.state.on,
				}
			}

		❌ some users don't provide props.onClick so this fails

		3rd: 

		onClick && onClick(...args); // custom

		😑 works, but could be improved using *Prop Getters*

		4th

		// PROP GETTER
		// accepts functions, returns a function that accepts args and calls all functions, one at a time passing the args
		const callAll = (...fns) => {
			return (...args) => {
				fns.forEach(fn => fn && fn(...args))
			}
		}

		usage:

		onClick: (...args) => {
			const fnn = callAll(onClick, this.toggle);
			fnn(...args);
		}

		5th
		Shorter version

		const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args))
		...
		onClick: callAll(onClick, this.toggle),


		YES!
		now it's easy to add custom things

		getTogglerProps = ({onClick, className, ...props}) => {
			...
			className: `${className} our-class-name`,

		TO OVERRIDE:
		user only needs to add/override custom stuff in the render
					<button 
						{...getTogglerProps({
							'aria-label':"custom-button",
							'aria-pressed': null,
							id:"custom-button-id",
							className: "custom-class",
							onClick:onButtonClick
						})}
						>
						{on ? 'on' : 'off'}
					</button>


		IF EVER THEY want to completely override onClick (NOT USING OUR REQUIRED onClick in toggler)
		<button
		   {...getTogglerProps({...})}
		   onClick={onButtonClick}
		</button>
*/

function onButtonClick() {
	console.log("waa");
}

function Usage({
	onToggle = (...args) => console.log("onToggle", ...args),
	name = "Benny"
}) {

	return (
		<Toggle onToggle={onToggle}>
			{({ on, getTogglerProps }) => (
				<div>
					{on ? 'The button is on' : 'The button is off'}
					<Switch {...getTogglerProps({on})} />
					<hr />
					<button 
						{...getTogglerProps({
							'aria-label':"custom-button",
							'aria-pressed': null,
							id:"custom-button-id",
							className: "custom-class",
							onClick:onButtonClick
						})}
						>
						{on ? 'on' : 'off'}
					</button>
				</div>
			)}
		</Toggle>
	)

	// return (
	// 	<Toggle onToggle={onToggle}>
	// 		{({ on, togglerProps }) => (
	// 			<div>
	// 				{on ? 'The button is on' : 'The button is off'}
	// 				<Switch on={on} {...togglerProps} />
	// 				<hr />
	// 				<button 
	// 					{...togglerProps}
	// 					aria-label="custom-button"
	// 					id="custom-button-id"
	// 					onClick={() => {
	// 						onButtonClick();
	// 						togglerProps.onClick();
	// 					}}
	// 					>
	// 					{on ? 'on' : 'off'}
	// 				</button>
	// 			</div>
	// 		)}
	// 	</Toggle>
	// )
}

export default Usage;
