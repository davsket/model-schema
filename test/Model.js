require.config({
	baseUrl: "../src"
});
require(['Model'], function(Model){
	describe("Model", function() {
		var Person, david, carolina

		beforeEach(function() {
			Person = new Model({
				name: null,
				age: null,
				sex: null
			})
			david = new Person({
				name: 'david',
				age: 27,
				sex: 'male'
			})
			carolina = new Person({
				name: 'carolina',
				age: 24,
				sex: 'female'
			})
		})

		it("should be able to create a new model", function() {
			expect(Person).toBeDefined()
		})

		it("the new model should have the 'objets' property", function() {
			expect(Person.objects).toBeDefined()
		})

		it("the new model should be able to list all objects", function() {
			expect(Person.objects.count()).toBe(2)
		})

		it("the new model should be able to filter by property", function() {
			expect(Person.objects.filter({age: 27}).length).toBe(1)
		})

		it("the new model should be able to get an object by id", function() {
			expect(Person.objects.get(david.__id__)).toBe(david)
		})

		it("the new model should be able to get an object by id", function() {
			expect(Person.objects.get(david.__id__)).toBe(david)
		})

		it("should be able to create an object by objects.create, and all objects should list the same", function() {
			var jack = Person.objects.create({
				name: 'jack',
				age: 56,
				sex: 'male'
			})
			// console.log(jack.__objects__.all().length)
			expect(jack).toBeDefined()
			expect(jack.__objects__.count()).toBe(3)
			expect(david.__objects__.count()).toBe(3)
			expect(carolina.__objects__.count()).toBe(3)
		})

		describe("Any object created", function() {
			beforeEach(function() {
			})

			it("the new object should have the properties assigned", function() {
				expect(david.name).toBe('david')
				expect(david.age).toBe(27)
				expect(david.sex).toBe('male')
			})

			it("the new object should have the __objects__ property", function() {
				expect(david.__objects__).toBeDefined()
			})

			it("the new object should be able to list his relatives", function() {
				expect(david.__objects__.count()).toBe(2)
			})

			it("the new object should be able equals to the listed element by id", function() {
				expect(david.__objects__.get(david.__id__)).toBe(david)
			})

			it("the david object should be able different to carolina", function() {
				expect(david).not.toBe(carolina)
			})

			it("the david object should be able get to carolina by it's id", function() {
				expect(david.__objects__.get(carolina.__id__)).toBe(carolina)
			})

			it("the david object should be able to get it's female relatives", function() {
				expect(david.__objects__.filter({sex: 'female'}).length).toBe(1)
			})
		})

		describe("Handling Events", function() {
			var spy

			beforeEach(function() {
				spy = jasmine.createSpyObj('spy', ['create', 'delete']);
				Person.objects.addEvent('create', spy.create)
				Person.objects.addEvent('delete', spy['delete'])
			})

			it("tracks that the create event was not fired", function() {
				expect(spy.create).not.toHaveBeenCalled()
			})

			it("tracks that the create event was fired", function() {
				new Person({
					name: 'Diana',
					age: 19,
					sex: 'female'
				})
				expect(spy.create).toHaveBeenCalled()
			})

			it("tracks that the delete event was not fired", function() {
				expect(spy['delete']).not.toHaveBeenCalled()
			})

			it("tracks that the delete event was fired", function() {
				var diana = new Person({
					name: 'Diana',
					age: 19,
					sex: 'female'
				})
				Person.objects['delete'](diana)
				expect(spy['delete']).toHaveBeenCalled()
			})

			it("tracks that the delete event was not fired when removed the event", function() {
				var diana = new Person({
					name: 'Diana',
					age: 19,
					sex: 'female'
				})
				Person.objects.removeEvent('delete', spy['delete'])
				Person.objects['delete'](diana)
				expect(spy['delete']).not.toHaveBeenCalled()
			})

		})

		describe("Complex Actions", function() {
			beforeEach(function() {
			})

			it("should add an object to the type", function() {
				var newGuy = {
					name: 'New guy',
					sex: 'male'
				}
				expect(Person.objects.add(newGuy)).toBe(newGuy)
				expect(newGuy.__id__).toBeDefined()
				expect(Person.objects.count()).toBe(3)
				expect(Person.objects.get(newGuy.__id__)).toBe(newGuy)
			})

			it("should be able to filter with an object", function() {
				var diana = new Person({
					name: 'Diana',
					age: 19,
					sex: 'female'
				})
				expect(Person.objects.filter({sex: 'female'}).length).toBe(2)
			})

			it("should be able to filter with a function", function() {
				expect(Person.objects.filter(function(obj){
					return obj.name == carolina.name
				})[0]).toBe(carolina)
			})

			it("should be able to exclude with an object", function() {
				var diana = new Person({
					name: 'Diana',
					age: 19,
					sex: 'female'
				})
				expect(Person.objects.exclude({name: diana.name}).length).toBe(2)
			})

			it("should be able to exclude with a function", function() {
				var diana = new Person({
					name: 'Diana',
					age: 19,
					sex: 'female'
				})
				expect(Person.objects.exclude(function(obj){
					return obj.sex == diana.sex
				}).length).toBe(1)
			})

			it("should be able to count the objects", function() {
				expect(Person.objects.count()).toBe(Person.objects.all().length)
			})

			it("should be able to sort the objects by attribute", function() {
				var diana = new Person({
					name: 'Diana',
					age: 19,
					sex: 'female'
				})
				expect(Person.objects.all()[0]).toBe(david)
				expect(Person.objects.sort('age')[0]).toBe(diana)
			})

			it("should be able to sort the objects by function", function() {
				var diana = new Person({
					name: 'Diana',
					age: 19,
					sex: 'female'
				})
				expect(Person.objects.all()[0]).toBe(david)
				expect(Person.objects.sort(function(a, b){
					return a.age - b.age
				})[0]).toBe(diana)
			})

			it("should be able to get an existing object by id", function() {
				expect(Person.objects.get(david.__id__)).toBe(david)
			})

			it("should be able to get an existing object by object with properties", function() {
				expect(Person.objects.get({name: david.name})).toBe(david)
			})

			it("should be able to get an existing object by value property", function() {
				expect(Person.objects.get('name', david.name)).toBe(david)
			})

			it("should be able to return an existing object by id via getOrCreate", function() {
				expect(Person.objects.getOrCreate(david.__id__)).toBe(david)
			})

			it("should be able to return an existing object by property via getOrCreate", function() {
				expect(Person.objects.getOrCreate({name: david.name})).toBe(david)
			})

			it("should create an object if it doesn't exist via getOrCreate", function() {
				var diana = Person.objects.getOrCreate({
					name: 'Diana',
					age: 34
				},
				{
					sex: 'female'
				})
				expect(diana).toBeDefined()
				expect(Person.objects.count()).toBe(3)
				expect(diana.sex).toBe('female')
			})

			it("should delete an object by id", function() {
				var diana = new Person({
					name: 'Diana',
					age: 19,
					sex: 'female'
				})
				Person.objects['delete'](diana.__id__)
				expect(Person.objects.count()).toBe(2)
			})

			it("should delete an object by passing the object", function() {
				var diana = new Person({
					name: 'Diana',
					age: 19,
					sex: 'female'
				})
				Person.objects['delete'](diana)
				expect(Person.objects.count()).toBe(2)
			})

		})

	})

})