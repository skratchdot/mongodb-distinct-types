(function () {
	var t = db.jstests_all;
	t.drop();

	// Empty collections
	assert.eq( [], t.distinctTypes('a') );
	assert.eq( 0, t.find().count() );

	// 1 Item
	t.save( { a : [] } );
	assert.eq( ['array'], t.distinctTypes('a') );
	assert.eq( [], t.distinctTypes('b') );
	assert.eq( 1, t.find().count() );

	// 2 arrays only reported once
	t.save( { a : [] } );
	assert.eq( ['array'], t.distinctTypes('a') );
	assert.eq( 2, t.find().count() );

	// Multiple types
	t.save( { a : 'wow' } );
	assert.eq( ['array','string'], t.distinctTypes('a') );
	assert.eq( 3, t.find().count() );

	// 'number' vs 'numberlong'
	t.save( { a : 5, b : NumberLong(5) } );
	assert.eq( ['array','string','number'], t.distinctTypes('a') );
	assert.eq( ['numberlong'], t.distinctTypes('b') );
	assert.eq( 4, t.find().count() );
	
	// date
	t.save( { c : new Date() } );
	assert.eq( ['date'], t.distinctTypes('c') );

	// null
	t.save( { d : null } );
	assert.eq( ['global'], t.distinctTypes('d') );

	// undefined
	t.save( { e : undefined } );
	assert.eq( ['global'], t.distinctTypes('e') );

	// boolean
	t.save( { f : true } );
	assert.eq( ['boolean'], t.distinctTypes('f') );

	// nested keys and objects
	assert.eq( [], t.distinctTypes('g.nested') );
	t.save( { g : { nested : 'foo' } } );
	assert.eq( ['bson'], t.distinctTypes('g') );
	assert.eq( ['string'], t.distinctTypes('g.nested') );
	
	// objectid
	t.save( { i : new ObjectId() } );
	assert.eq( ['objectid'], t.distinctTypes('i') );
	
	// bindata
	t.save( { j : new BinData(2, '1234') } );
	assert.eq( ['bindata'], t.distinctTypes('j') );

	t.drop();
}());