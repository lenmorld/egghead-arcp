yarn dev

localhost:8080


1, 2 - simple toggle component

3- compound component : sharing state implicitly with child components
each innner compound component (Toggle.On, Toggle.Off, Toggle.Button all implemented as a static stateless component) 
has access to the parent Toggle's state (on) and handler method (toggle) 
- using React.Children.map and React.cloneElement

✅ component users can render in any order, without any render config whatsoever


4 - Context : make compound component more flexible, so it won't break with say, `<div><Toggle.Button></div>`


5 - Validate context consumer : what if a Consumer is rendered outside of a Provider
e.g. replace <Toggle ... with <div...

-> Encapsulate consumer in a function, so we can add validation
this is possible because the child of a context consumer is a function

```javascript
<ToggleContext.Consumer>{(contextValue) => blah}</ToggleContext.Consumer>
```

```javascript
function ToggleConsumer(props) {
	return (
		<ToggleContext.Consumer>
			{context => {
					if (!context) {
					throw new Error('must use consumer inside provider');
				}
				return props.children(context)
			}}
		</ToggleContext.Consumer>
	)
}
...
<ToggleConsumer>{(contextValue) => blah}</ToggleConsumer>
```

6 - reducing re-renders

everytime value exposed by Provider changes, all Consumers are re-rendered
right now, it changes every single render
since value is recreated every render 
```javascript
	<ToggleContext.Provider
		value={{
			on: this.state.on,
			toggle: this.toggle
		}}
	>
```

but for our use case, it should only re-render when `this.state.on` changes

-> put event handler in state, since it shouldn't change
so here we put entire state in provider value

it might be weird to put event handler in state, 
but this is a nice tradeoff when using context

```javascript
state = { on: false, toggle: this.toggle };
...
<ToggleContext.Provider
	value={this.state}
>
```

7 - render props
step back from Context, we re-use Lesson 1's simple Toggle

Currently the <Toggle /> component has complete control over rendering, 
and it's not too flexible for Usage
suppose component user wants to render the logic in the component 
in a different way, we are currently limited to how the Toggle renders it

1st: separate rendering into a function outside class definition,
since it doesn't need any instance method/props

```javascript
const renderUI = ({ on, toggle }) => {
	return <Switch on={on} onClick={toggle} />;
}
...
	render() {
		return renderUI({
```

2nd: make `renderUI` a prop, that defaults to the function

```javascript
static defaultProps = { renderUI }
...
	render() {
		return this.props.renderUI({

...users:
		<Toggle onToggle={onToggle} renderUI={({ on, toggle }) => (
				<div>any JSX we want that uses `on`, `toggle`</div>
		)} />

```
this way, component users can use this API
to supply their own JSX using `render` prop

3rd:
rename to `this.props.children()` instead of `renderUI`
so users can sandwich JSX

## Render prop
most primitive from of UI flexibility
any other pattern can be implemented on top of this API

e.g. implement

8. Prop Collections with Render Props

We extend the API even further by allowing 
props (toggler props object) to be spread on whatever element (any button they want to represent the toggle, that fits their ise case)
the consumer will use on their render

```javascript
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

	render...
		return this.props.children(this.getStateAndHelpers());


	usage... note togglerProps, which encapsulates the handler and a11y features
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
```