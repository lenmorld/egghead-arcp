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
		// return this.renderUI({
		// return renderUI({
		return this.props.renderUI({
			on: this.state.on,
			toggle: this.toggle
		});
	}
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
	return (
		<Toggle onToggle={onToggle} renderUI={({ on, toggle }) => (
			<div>
				{on ? 'The button is on' : 'The button is off'}
				<Switch on={on} onClick={toggle} />
				<hr />
				<button aria-label="custom-button" onClick={toggle}>
					{on ? 'on' : 'off'}
				</button>
			</div>
		)}>
		</Toggle>
	)

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
}

export default Usage;
