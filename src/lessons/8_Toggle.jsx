/*
	Lesson 8
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

	getStateAndHelpers() {
		return {
			on: this.state.on,
			toggle: this.toggle,
			togglerProps: {
				onClick: this.toggle,	// e.g. this can be later changed to a keydown, which will be an impl. detail
				// that the consumers don't need to know about
				'aria-pressed': this.state.on,
			}
		}
	}

	render() {
		// return this.props.children({
		// 	on: this.state.on,
		// 	toggle: this.toggle
		// });

		// generalize the stateAndHelper getter
		return this.props.children(this.getStateAndHelpers());
	}
}

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

	// introduce a togglerProps (which replaces the onToggle)
	// that can be spread across any toggle button
	// that the consumers want to render

	// consumer doesnt need to know how to wire up these buttons <Switch /> and <button>
	// to be toggles in this toggle component

	return (
		<Toggle onToggle={onToggle}>
			{({ on, togglerProps }) => (
				<div>
					{on ? 'The button is on' : 'The button is off'}
					<Switch on={on} {...togglerProps} />
					<hr />
					<button aria-label="custom-button" {...togglerProps}>
						{on ? 'on' : 'off'}
					</button>
				</div>
			)}
		</Toggle>
	)

}

export default Usage;
