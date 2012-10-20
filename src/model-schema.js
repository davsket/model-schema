/*!
 * Model.js 0.1 r1
 * http://davsket.me/orm
 * MIT licensed
 * 
 * Copyright (C) 2012-2013 David Avellaneda, http://davsket.me
 */
define('./Model', function(){
	var Model

	/**
	* An observable ORM
	* @param {Object} classObject an object with the Class attributes
	* @requires Mootools.Core.Class, Mootools.Core.Events, Mootools.Core.typeOf
	*/
	Model = function(classObject){
		var _collection = [], ClassModel, key, 
			old_initialize, consecutive = 0,
			idMap = {}
		
		this.objects = {
			/**
			* Returns the collection array with all the objects
			* @return {Array} the colection
			*/
			all: function(){
				return _collection.slice()
			},

			/**
			* Creates a new item
			* @return {Object} the item created
			*/
			create: function(options){
				var item = new ClassModel(options)
				// Now is added in the constructor
				// _collection.push(item) 
				return item
			},

			/**
			* Adds the item to the _collection
			* @return {Object} the item created
			*/
			add: function(item){
				if(!('__id__' in item)){
					if('defineProperty' in Object){
						Object.defineProperty(item, '__id__', {
							value: consecutive,
							enumerable: false 
						});
					}else{
						item.__id__ = consecutive
					}
				}
				_collection.push(item)
				idMap[item.__id__] = item
				return item
			},

			/**
			* Filters the _collection of objects given the conditions
			* @param  {Object} or {Function} filters propperties 
			*                     and values to validate, or a function
			* @return {Array}         The _collection filtered
			*/
			filter: function(filters){
				if(typeOf(filters) == 'function')
					return _collection.filter(filters)
				return _collection.filter(function(item){
					for(var key in filters) 
						if(item[key] !== filters[key]) 
							return false
					return true
				})
			},

			/**
			* Excludes some objects from the _collection of objects given 
			* the conditions
			* @param  {Object} or {Function} filters propperties 
			*                     and values to validate, or a function
			* @return {Array}         The _collection filtered
			*/
			exclude: function(filters){
				if(typeOf(filters) == 'function')
					return _collection.filter(function(item){
						return !filters(item)
					})
				return _collection.filter(function(item){
					for(var key in filters) 
						if(item[key] === filters[key]) 
							return false
					return true
				})
			},

			/**
			* Returns the length of the _collection	
			* @return {Number} the collection length
			*/
			count: function(){
				return _collection.length
			},

			/**
			* Sorts the _collection by the given function/attribute 
			* @param  {String|Function} attribute key attribute to order by or the function to use
			* @return {Array}           the _collection sorted
			*/
			sort: function(funcOrAttr){
				if(typeOf(funcOrAttr) == 'function'){
					return _collection.slice().sort(funcOrAttr)
				}
				return _collection.slice().sort(function(a, b){
					if(typeof a[funcOrAttr] == 'number')
						return a[funcOrAttr] - b[funcOrAttr]
					else
						return a[funcOrAttr] > b[funcOrAttr] ? 1 : a[funcOrAttr] < b[funcOrAttr] ? -1 : 0
				})
			},

			/**
			* Returns the first match of an object that math an attribute with 
			* the given value
			* @param  {String} attribute
			* @param  {Any} value 
			* @return {Object} 
			*/
			get: function(attribute, value){
				var i, key

				if(typeof value == 'undefined' && 
					typeof attribute == 'number')
					return idMap[attribute]
				
				if(typeof attribute == 'object'){
					for(key in attribute){
						for(i = 0; i<_collection.length; i++){
							if(_collection[i][key] === attribute[key])
								return _collection[i]
						}
					}
				}

				if(typeof value != 'undefined'){
					for(i = 0; i<_collection.length; i++){
						if(_collection[i][attribute] === value)
							return _collection[i]
					}
				}

				return null
			},

			/**
			* Inspired in https://docs.djangoproject.com/en/dev/ref/models/querysets/#get-or-create
			* @param  {Object} search	object with the attributes values to search for
			* @param  {Object} extra	nonsearchable attributes for initialization (via Object.merge)
			* @return {Object}		the item created
			*/	
			getOrCreate: function(search, extra){
				var resp

				//First use the get method to search for it
				if((resp = this.get(search)))
					return resp

				//Else the object doesn't exist, so merge them to create
				Object.merge(search, extra)
					
				return this.create(search)
			},

			/**
			* Deletes the given object if it exists in the collection
			* @return {Boolean} true if deleted the element, false either
			*/
			'delete': function(object){
				var obj, index
				
				//By id
				if(typeof object == 'number'){
					if((obj = idMap[object])){
						_collection.indexOf(obj)
						//It's assumed that the object exists in the array
						_collection.splice(index, 1);
						delete idMap[object.__id__]
						this.fireEvent('delete', obj)
						return true
					}
					return false
				}

				//By object index
				index = _collection.indexOf(object);
				if(~index){
					_collection.splice(index, 1);
					delete idMap[object.__id__]
					this.fireEvent('delete', object)
					return true
				}

				return false
			},

			/**
			* Event Handling
			*/
			observersType: {},

			fireEvent: function(eventName){
				this.observersType[eventName] = this.observersType[eventName] || []
				var i = 0, observers = this.observersType[eventName],
					args = [].slice.call(arguments)
				args.splice(0,1,this)
				for(; i<observers.length; i++){
					observers[i].apply(this, args)
				}
			},

			addEvent: function(eventName, func){
				this.observersType[eventName] = this.observersType[eventName] || []
				if(!~this.observersType[eventName].indexOf(func)){
					this.observersType[eventName].push(func)
				}
			},

			removeEvent: function(eventName, func){
				var index
				this.observersType[eventName] = this.observersType[eventName] || []
				if(~(index = this.observersType[eventName].indexOf(func))){
					this.observersType[eventName].splice(index, 1)
				}
			}

		}

		//If not given an initialization function,
		//is asigned a lambda, but stored elsewhere
		old_initialize = classObject.initialize || function(obj){
			for(var key in obj){
				if(typeof this[key] != 'undefined')
					this[key] = obj[key]
			}
		}

		/**
		* This function replaces the initialization for every 
		* Class item created for id assignment (only once)
		*/
		classObject.initialize = function(){
			//If Object let us  add non enumerable
			//properties the id is assigned as a
			//non enumerable
			if('defineProperty' in Object){
				Object.defineProperty(this, '__id__', {
					value: consecutive,
					enumerable: false 
				});
			}else{ 
				//Else added directly in the object
				this.__id__ = consecutive
			}

			//Increment the consecutive for the next elements
			consecutive ++
			//The created item is added to the collection of the Model
			this.__objects__.add(this)
			//Then is reasigned the original one
			this.initialize = old_initialize
			//And invoked
			this.initialize.apply(this, [].slice.call(arguments))
			//Event firing
			this.__objects__.fireEvent('create', this)
		}

		//Adding events handable for listening
		if(classObject.Implements){
			if(typeOf(classObject.Implements) == 'array' &&
				~classObject.Implements.indexOf(Events)){
				classObject.Implements.push(Events)
			}else if(typeOf(classObject.Implements) != 'array'){
				classObject.Implements = [classObject.Implements, Events]
			}
		}else{
			classObject.Implements = Events
		}

		//The new model item is created using the update
		//classObject
		ClassModel = new Class(classObject) 
		
		//If Object let us  add non enumerable
		//properties the objects attribute is
		//assigned to the ClassModel and to the 
		//ClassModel.prototype objects, so it's possible
		//to acces to all the objects from every item
		//created or via the ClassModel
		if('defineProperty' in Object){
			Object.defineProperty(ClassModel.prototype, '__objects__', {
				value: this.objects,
				enumerable: false 
			});
			Object.defineProperty(ClassModel, 'objects', {
				value: this.objects,
				enumerable: false 
			});
		}else{
			ClassModel.prototype.__objects__ = this.objects
			ClassModel.objects = this.objects
		}

		//The ClassModel (not this function) is returned,
		//so a new scope is created for the new ClassModel,
		//but is used de Class object.
		return ClassModel
	}

	return Model
})