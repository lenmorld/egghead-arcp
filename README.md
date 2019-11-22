yarn dev

localhost:8080


1, 2 - simple toggle component

> a simple toggle component which will serve as the foundation for the rest of the course. Kent walks through how to create a simple toggle with React setState. He shows us how to extend the functionality of the toggle by safely adding an onToggle prop that gets called after state is updated.

3- compound component : 

> Compound components give more rendering control to the user. The functionality of the component stays intact while how it looks and the order of the children can be changed at will. We get this functionality by using the special React.Children.map function to map over the children given to our <Toggle/> component. We map over the children to pass the on state as a prop to its children. We move the visual pieces of the component out into function components and add them as static properties to <Toggle/>.

sharing state implicitly with child components
each innner compound component (Toggle.On, Toggle.Off, Toggle.Button all implemented as a static stateless component) 
has access to the parent Toggle's state (on) and handler method (toggle) 
- using React.Children.map and React.cloneElement

✅ component users can render in any order, without any render config whatsoever


4 - Context : make compound component more flexible, so it won't break with say, `<div><Toggle.Button></div>`

> Our current compound component implementation is great, but it's limited in that users cannot render the structure they need. Let's allow the user to have more flexibility by using React context to share the implicit state to our child <Toggle/> components. We will walk through using React's official context API with React.createContext and use the given Provider and Consumer components to share state implicitly between our compound components giving our users the flexibility they need out of our component.

5 - Validate context consumer 

> If someone uses one of our compound components outside the React.createContext <ToggleContext.Provider />, they will experience a confusing error. We could provide a default value for our context, but in our situation that doesn't make sense. Instead let's build a simple function component which does validation of our contextValue that comes from the <ToggleContext.Consumer />. That way we can provide a more helpful error message.


what if a Consumer is rendered outside of a Provider
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

> Due to the way that React Context Providers work, our current implementation re-renders all our compound component consumers with every render of the <Toggle /> which could lead to unnecessary re-renders. Let's fix that by ensuring that the value prop we pass to the <ToggleContext.Provider /> is only changed when the state changes.

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

> A render prop is a function that renders JSX based on state and helper arguments. This pattern is the most flexible way to share component logic while giving complete UI flexibility.

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

> Sometimes you have common use cases that require common props to be applied to certain elements. You can collect these props into an object for users to simply apply to their elements and we'll see how to do that in this lesson.

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


9. Prop getters

> enable composition of users' custom props and our required toggler props by using a convenience method `getTogglerProps`, along with a `callAll` that calls all functions given all args (useful for e.g. calling both onClick from custom and ours with the same args)
> perfect for custom `onClick`, `className`, other props by users that we want to just pass through to our component, without exposing implementation details

```javascript
	getTogglerProps = ({onClick, className, ...props}) => {
		// debugger;
		return {
			...props,
			onClick: callAll(onClick, this.toggle),
			className: `${className} our-class-name`,
			'aria-pressed': this.state.on,
		}
	}
```

usage:
```javascript
	<Switch {...getTogglerProps({on})} />
	<hr />
	<button 
		{...getTogglerProps({
			'aria-label':"custom-button", // custom
			'aria-pressed': null, // custom
			id:"custom-button-id", // custom
			className: "custom-class", // custom
			onClick:onButtonClick    // custom
		})}
		>
		{on ? 'on' : 'off'}
	</button>
```

When you're using prop collections, sometimes you can run into trouble with exposing implementation details of your prop collections. In this lesson, we'll see how we can abstract that away by simply creating a function called a prop getter that will compose the user's props with our prop collection.