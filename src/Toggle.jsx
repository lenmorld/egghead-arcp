import React from "react";
import { Switch } from "./Switch";

class Toggle extends React.Component {
	// class properties
	state = { on: false };
	toggle = () =>
		this.setState(
			({ on }) => ({ on: !on }),
			() => {
				this.props.onToggle(this.state.on);
			}
		);
	// setState uses function (instead of object)
	// and runs callback after

	render() {
		return <Switch on={this.state.on} onClick={this.toggle} />;
	}
}

// passing a function prop to a stateless component
// destructuring to only get the onToggle prop
function Usage({
	onToggle = (...args) => console.log("onToggle", ...args),
	name = "Benny"
}) {
	console.log(name);
	return <Toggle onToggle={onToggle} />;
}

export default Usage;
