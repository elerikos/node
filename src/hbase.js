var assert = require('assert');
var hbase = require('hbase');


///   NEEDS THE HBASE STARGATE TO HAVE STARTED !!!!

var client = hbase({
		host: 'erik',
		port: 8080
	});



client.getTables( function( error, tables ){

    console.log("-------------------------");
	console.log( tables );
} );


//Grab an instance of "hbase.Table"
var myTable = hbase({}).getTable('my_table');

//var myRow1 = new hbase.Row(client, 'target', '0000000000000LastRow');
//console.log(myRow1);


//Create a new table in HBase
/*var myTable = client.getTable('target1');
myTable.create('my_new_column',function(error, success){
		console.log('Table created: ' + (success ? 'yes' : 'no'));
	} )*/

///Drop an existing table
/*
client.getTable('target1')
.delete(function(error, success){
	assert.ok(success);
});
*/

//Retrieves table schema

client.getTable( 'target' )
	.getSchema(function(error, schema){
		console.log("-------------------------");
		console.log(schema);
	})


//Retrieves table region metadata
client.getTable( 'target' )
	.getRegions(function(error, regions){
        console.log("-------------------------");
		console.log(regions);
	})


//Grab an instance of "Row"
	var myRow = client.getRow('target','my_row');


myRow.exists(function(error, exists){
	assert.strictEqual(true, exists);
    console.log('Table exists: ' + (exists ? 'yes' : 'no'));
});


//Retrieve values from HBase
myRow.get(function(error, value){
    console.log("-----------a--------------");
	console.log(value);
});
myRow.get('my_column_family', {v: 1}, function(error, value){
    console.log("-----------B--------------");
	console.log(value);
});
myRow.get('my_column_family:my_column', function(error, value){
    console.log("-----------C--------------");
	console.log(value);
});




//Insert and update a column value
myRow.put('my_column_family:my_column', 'my value1', function(error, success){
	assert.strictEqual(true, success);
});
//   hbase({ host: 'erik', port: 2181 })
/*client.getTable('target' )
   .create('my_column_family', function(err, success){
       this
       .getRow('my_row')
       .put('my_column_family:my_column', 'my value', function(err, success){
           this.get('my_column_family', function(err, cells){
               this.exists(function(err, exists){
                   assert.ok(exists);
               });
           });
       });
   });*/
