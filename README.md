# Model.js

An easy-lightweigth ORM inspired in the Django framework, and developed over Mootools.Core.Class basis. It let you define new Models (Class style), and provides all the ORM management facilities - In the future I'm going to develop the jQuery version -

You can get [the minified version from the downloads](https://github.com/davsket/model-schema/downloads), its only 2.64KB (915 bytes gzipped) or by downloading the complete code, in the `src` folder.

## Requirements

This version requires the Class implementation by Mootools, and it uses require.js (but that's optional)

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
Person.objects.all() // [david, carolina, diana]
diana.__objects__.all() // [david, carolina, diana]
```

### Filter the objects collection

You can filter with an object or a function

```javascript
Person.objects.filter({sex: 'female'}) // [carolina, diana]
```
```javascript
Person.objects.filter(function(obj){
	return age > 23
}) // [david, carolina]
```

### Exclude the objects collection

You can exclude with an object or a function

```javascript
Person.objects.exclude({sex: 'female'}) // [david]
```
```javascript
Person.objects.exclude(function(obj){
	return age > 23
}) // [diana]
```

### Count collection

You can exclude with an object or a function

```javascript
Person.objects.count() // 3
```

### Sort the objects collection

You can sort the collection by attribute or function

```javascript
Person.objects.sort(function(a, b){
	return a.age - b.age
}) // [diana, carolina, david]
```
```javascript
Person.objects.sort('name') // [david, diana, carolina]
```

### Get an element by attribute(s)

You can get an element by: id, attribute/value, or attributes

```javascript
Person.objects.get(david.__id__) // david
```
```javascript
Person.objects.get('name', carolina.name) // carolina
```
```javascript
Person.objects.get({age: 22}) // diana
```

### Delete an element

You can delete an element by: id or passing the object

```javascript
Person.objects.delete(david.__id__) // returns david
Person.objects.all // [carolina, diana]
```
```javascript
Person.objects.delete(diana) // returns diana
Person.objects.all // [carolina]
```

## License

MIT Licensed