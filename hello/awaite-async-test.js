async function f() {
	let promise = new Promise( (resolve, reject) => {
		setTimeout( () => resolve("done!"), 1000)
	});

	let result = await promise;
	console.log(result);
}

function f2() {
	let promise = new Promise( (resolve, reject) => {
		setTimeout( () => resolve("done!"), 1000)
	});

	promise.then(
		result =>  console.log('result: ', result),
		error =>  console.log('result: ', result)
	);
	console.log(result);
}

function loadScript(src, callback) {
	let script = document.createElement('script');
	script.src = src;
	script.onload = () => callback(script);
	document.head.append(script);
}

const meetCustomer = (id) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			console.log(`Waiter approached customer a table #${id}...`);
			resolve({customerId: id});
		}, 2000);
	});
}

const getOrder = (id) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			console.log(`Order received for customer at table #${id}...`);
			resolve({customerId: id, customerOrder: 'Pizza'});
		}, 2000);
	});
}

const notifyWaiter = (id) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			console.log(`Order for customer at table #${id} processed...`);
			resolve({customerId: id, customerOrder: 'Pizza'});
		}, 2000);
	});
}

const serveCustomer = (id) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			console.log(`Customer with order number #${id} served...`);
			resolve({customerId: id, customerOrder: 'Pizza'});
		}, 2000);
	});
}

meetCustomer(1)
	.then((order) => getOrder(order.customerId))
	.then((order) => notifyWaiter(order.customerId))
	.then((order) => serveCustomer(order.customerId))
	.catch((err) => console.log("Error: ", err.message));

const runRestaurant = async (customerId) => {
	if(!!!customerId)
		throw new Error("Invalid CustometId!");
	// if(!!!customerId) 
	// 	await Promise.reject(new Error("Invalid CustometId!"));

	try {
		const customer = await meetCustomer(customerId);
		const order = await getOrder(customer.customerId);
		await notifyWaiter(order.customerId);
		await serveCustomer(order.customerId);
		// console.log(`Order of customer fulfilled...`);
	} catch (error) {
		console.log("Error: ", error.message);
	}
}

runRestaurant(1)
	.then(() => console.log(`Order of customer fulfilled...`))
	.catch((error) => console.log(error));


const placeOrder = (customerId, callback) => {
	console.log('Preparing dish...');
	setTimeout(() => {
		console.log('Dish prepared...');
		callback({customerId: customerId, customerOrder: 'Pizza'});
	}, 2000);
}

placeOrder(1, (order) => console.log('Order: ', order));

// f();

// loadScript('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.2.0/lodash.js', function() {
// 	console.log('callbacke called');
// 	loadScript('/my.js', function() {
// 		console.log('callback called');
// 	});
// });

// loadScript('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.2.0/lodash.js', function(error, script) {
// 	console.log('callbacke called');
// 	if(error) {

// 	} else {

// 	}
// });