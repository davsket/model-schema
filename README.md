# Model.js

An easy ORM inspired in the Django framework, and developed over Mootools.Core.Class basis.

It let you define new Models (Class style), and provides all the ORM management facilities.

## Requirements

This version requires the Class implementation by Mootools, and uses require.js (but it's optional)

## Usage

First import it via require:

```javascript
require(['Model'], function(Model){
	// Your Code
})
```

or

```javascript
Model = require('Model')
```

### Defining a Model

Create a model is as easy as creating a Mootools Class

```javascript
var Person = new Model({
		name: null,
		age: null,
		sex: null
	})
```

### Creating objects

You have three ways to create a new object:

```javascript
var david = new Person({
		name: 'david',
		age: 27,
		sex: 'male'
	}),
	carolina = Person.objects.create({
		name: 'carolina',
		age: 24,
		sex: 'female'
	}),
	diana = carolina.__objects__.create({
		name: 'diana',
		age: 22,
		sex: 'female'
	})
```

### Listing the objects

```javascript
Person.objects.all() // david, carolina, diana
diana.__objects__.all() // david, carolina, diana
```

## License

MIT Licensed