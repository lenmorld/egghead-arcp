/*
	Lesson 7: Validate compound component context consumers
*/

import React from "react";
import { Switch } from "./Switch";

const renderUI = ({ on, toggle }) => {
	return <Switch on={on} onClick={toggle} />;
}

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

	// pure function, but we don't need this on the instance (this.renderUI)
	// since it's not using any instance methods, props
	// we can move this to outside
	// renderUI({ on, toggle }) {
	// 	return <Switch on={on} onClick={toggle} />;
	// }

	render() {
		// 1 return this.renderUI({
		// 2 return renderUI({
		// 3 return this.props.renderUI({
		return this.props.children({
			on: this.state.on,
			toggle: this.toggle
		});
	}
}

// implement previous API we had with the new one
// let's say we have a common use case CommonToggle
// that provides your own children function that renders the common UI
// e.g <Switch
// CommonToggle has a limited flexbility but a simpler API
// built on top of render prop

function CommonToggle(props) {
	return <Toggle {...props}>
		{({ on, toggle }) => <Switch on={on} onClick={toggle} />}
	</Toggle>
}

function Usage({
	onToggle = (...args) => console.log("onToggle", ...args),
	name = "Benny"
}) {
	console.log(name);
	// return <Toggle onToggle={onToggle} />;

	// But we want to do this from the Component user! (Usage)
	// render a div, a Switch, a custom button
	// using the Component

	// 1
	// return (
	// 	<Toggle onToggle={onToggle} renderUI={({ on, toggle }) => (
	// 		<div>
	// 			{on ? 'The button is on' : 'The button is off'}
	// 			<Switch on={on} onClick={toggle} />
	// 			<hr />
	// 			<button aria-label="custom-button" onClick={toggle}>
	// 				{on ? 'on' : 'off'}
	// 			</button>
	// 		</div>
	// 	)}>
	// 	</Toggle>
	// )

	// 2
	// use with children instead for best reusability
	// return (
	// 	<Toggle onToggle={onToggle}>
	// 		{({ on, toggle }) => (
	// 			<div>
	// 				{on ? 'The button is on' : 'The button is off'}
	// 				<Switch on={on} onClick={toggle} />
	// 				<hr />
	// 				<button aria-label="custom-button" onClick={toggle}>
	// 					{on ? 'on' : 'off'}
	// 				</button>
	// 			</div>
	// 		)}
	// 	</Toggle>
	// )

	// 3
	// use a simpler API, which is a common use case
	return <CommonToggle onToggle={onToggle} />
}

export default Usage;
