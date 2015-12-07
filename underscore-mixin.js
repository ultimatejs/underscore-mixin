if(typeof _ === 'undefined') {
	console.log('Underscore is not defined. Make sure your packages add it first.');
	return; //dont depend on any particular underscore version, so it might not be defined
}

_.mixin({
	//extending using Property Descriptors so object getter/setters can be used (e.g. get someMethod()...)
	extend: function(obj) {
		Array.prototype.slice.call(arguments, 1).forEach(function(source) {
	    var descriptor, prop;
			
	    if(source) {
        for(prop in source) {
          descriptor = Object.getOwnPropertyDescriptor(source, prop);
					
					if(descriptor) Object.defineProperty(obj, prop, descriptor);
					else obj[prop] = source[prop];  
        }
	    }
    });
		
    return obj;
	},
	babelExtend: function(obj) {
		Array.prototype.slice.call(arguments, 1).forEach(function(source) {
	    var descriptor, prop,
				props = Object.getOwnPropertyNames(source);

	    if(source) {
				_.each(props, function(prop) {
          descriptor = Object.getOwnPropertyDescriptor(source, prop);
					
					if(descriptor) { //getters and setters from classes need enumerable == true to be added in future extending
						if(descriptor.get || descriptor.set) descriptor.enumerable = true;
						Object.defineProperty(obj, prop, descriptor);
					}
					else obj[prop] = source[prop];
				});
	    }
    });
		
    return obj;
	},
	

 	mapObject: function(obj, func, context, useOriginalObj) {
		var newObj = useOriginalObj ? obj : {},
			context = context || (useOriginalObj ? obj : newObj);
		  
		_.each(obj, function(v, k) {
			newObj[k] = func.call(context, v, k);
		});
	
		return newObj;
	},
 	mapObjectToArray: function(obj, func, context) {
		var context = context || obj,
			arr = [];
		  
		_.each(obj, function(v, k) {
			arr.push(func.call(context, v, k));
		});
	
		return arr;
	},
	filterObject: function(obj, isTrue, ctx) {
		var newObj = {};

		_.each(obj, function(v, k) {
			if(isTrue.call(ctx || obj, v, k)) newObj[k] = v;
		});
	
		return newObj;
	},
	bindContext: function(obj, context) {
		return _.mapObject(obj, function(func) {
			return _.isFunction(func) ? func.bind(context)  : func;
		});
	},
	filterPrototype: function(obj, isTrue, ctx) {
		var newObj = {};

		_.eachOfPrototype(obj, function(v, k) {
			if(isTrue.call(ctx || obj, v, k)) newObj[k] = v;
		});

		return newObj;
	},
	eachOfPrototype: function(obj, func, ctx) {
		for(var prop in obj) {
			func.call(ctx, obj[prop], prop);
		}
	},
	invokeNextApply: function(objects, method, ctx, args) {
		var callNext;
		
		_.some(objects, function(obj) {
			if(callNext === false) return true;
			else callNext = obj[method].apply(ctx || obj, args);
		});
		
		return callNext;
	},
	invokeNext: function(objects, method, ctx) {
		var callNext,
			args = _.toArray(arguments).slice(3);
		
		_.some(objects, function(obj) {
			if(callNext === false) return true;
			else callNext = obj[method].apply(ctx || obj, args);
		});
		
		return callNext;
	},
	applyNext: function(funcs, args, ctx) {
		var callNext;
		
		_.some(funcs, function(func) {
			if(callNext === false) return true;
			else callNext = func.apply(ctx, args);
		});
		
		return callNext;
	},
	callNext: function(funcs, ctx, additionalArgs) {
		var callNext,
			args = _.toArray(arguments).slice(2);
		
		_.some(funcs, function(func) {
			if(callNext === false) return true;
			else callNext = func.apply(ctx, args);
		});
		
		return callNext;
	},
	invokeApply: function() {
		var args = _.toArray(arguments),
			list = args.shift(),
			methodName = args.shift(),
			actualArgs = args.shift() || [];

		actualArgs.shift(methodName);
		actualArgs.shift(list);
		
		return _.invoke.apply(_, actualArgs);
	},
	containsSome: function(fields, some) {
		return _.some(fields, function(field) {
			return _.contains(some, field);
		});
	},
	findAndMap: function(obj, filterFunc, mapFunc, context) { 
		var result = _.find(obj, function(v, k) {
				return filterFunc.call(context, v, k);
			});

		if(!result || _.isNaN(result)) return null;

		return mapFunc.call(context, result);
	},
	pickAndBind: function(obj, props, context) {
		context = context || obj;
		props = [].concat(props);
		
		return _.chain(obj)
			.pick(props)
			.mapObject(function(v) {
				return _.isFunction(v) ? v.bind(context) : v;
			}).value();
	},
	arrayLastValue: function(arr) {
		return arr[arr.length - 1];
	},
	callbackFromArguments: function(args) {
		var callback = _.arrayLastValue(args);
		return _.isFunction(callback) ? Array.prototype.pop.call(args) : null;
	},
	lastObjectFromArguments: function(arr) {
		var obj = _.arrayLastValue(arr);

		if(_.isObject(obj)) return _.isArray(arr) ? arr.pop() : obj;
		else return null;
	},
	mapObjectAndCall: function(obj, context) {
		return _.mapObject(obj, function(propOrFunc, name) {
			return _.isFunction(propOrFunc) ? propOrFunc.call(context) : propOrFunc;
		});
	},
	mapObjectAndCallAndExtend: function(toObj, obj, context) {
		context = context || toObj;
		return _.extend(toObj, _.mapObjectAndCall(obj, context));
	},
	extendMultiple: function(intoObjects) {
		var args = _.toArray(arguments),
		  	intoObjects = args.shift();

		_.each(intoObjects, function(obj) {
			var newArgs = [obj].concat(args);
			_.extend.apply(_, newArgs);
		});

		return intoObjects;
	},
	isPureObject: function(obj) {
		return _.isObject(obj) && !_.isFunction(obj) && !_.isArray(obj);
	},
	firstName: function(fullName) {
		return _.first(fullName.split(' '));
	},
	lastName: function(fullName) {
		var parts = fullName.split(' ');
		
		if(!parts[1]) return '';
		else return _.last(fullName.split(' '));
	},
	objectContains: function(obj, field1, field2, fieldEtc) {
		var newObj = _.pick.apply(_, arguments);
		return !_.isEmpty(newObj);
	},
	isInt: function(number, allowStringNumber) {
		if(allowStringNumber) number = parseInt(number);
		return _.isNumber(number) && !_.isNaN(number) && (number+'').indexOf('.') === -1;
	},
	pickArray: function(obj, props) {
		props.unshift(obj);
		return _.pick.apply(_, props);
	},
	omitArray: function(obj, props) {
		props.unshift(obj);
		return _.omit.apply(_, props);
	},
	withoutArray: function(arr, withoutArr) {
		var args = [arr].concat(withoutArr)
		return _.without.apply(_, args);
	},
	pluckObj: function(objects, props) {
		props = _.isArray(props) ? props : _.toArray(arguments).slice(1);
		
		return _.map(objects, function(obj) {
			return _.pick(obj, props);
		});
	},
	isNumeric: function(num) {
		return !isNaN(num) && num !== '';
	},
	findIndex: function(array, predicate, context) {
		var index;
		
    for(index = 0; index >= 0 && index < array.length; index += 1) {
      if(predicate.call(context, array[index], index, array)) return index;
    }
		
    return -1;
	},
	zipToObject: function(arr1, arr2) {
		var obj = {};
		
		_.each(arr1, function(key, index) {
			obj[key] = arr2[index];
		});
		
		return obj;
	}
});
