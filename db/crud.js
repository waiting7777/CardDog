const fs = require('fs');
const csvtojson = require('csvtojson');
const CardPrice = require('./db').CardPrice;

let Converter = csvtojson.Converter;
let converter = new Converter({});

let newCardPrice = CardPrice({});

function create_data(){

    let d = new Date();
    let n = d.toLocaleDateString();

    converter.on('end_parsed', function(data){
        for(let i = 0; i < data.length; i++){
            console.log(data[i]);
            newCardPrice = CardPrice({
                CardName : data[i].CardName,
                CardNumber : data[i].CardNumber,
                CardSet : data[i].CardSet,
                CardPrice : data[i].CardPrice,
                Date : n
            });
            newCardPrice.save(function(err){
                if(err) throw err;
            });
        }
    });

    fs.createReadStream('../../mtgcard/dailyprice/kld/' + n + '.csv').pipe(converter);
}

function read_data(){
    CardPrice.find({}, function(err, cards){
        if(err) throw err;

        console.log(cards);
    });
}

function update_data(){

}

function delete_data(){
    CardPrice.remove({}, function(err){
        if(err) throw err;

        console.log('Data Deleted!');
    });
}

read_data();
return;
