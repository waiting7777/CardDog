const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mtgcard');

var Schema = mongoose.Schema;

var cardPriceSchema = new Schema({
    CardName : String,
    CardPrice : Number,
    Date : Date
});

let CardPrice = mongoose.model('CardPrice', cardPriceSchema);

module.exports.CardPrice = CardPrice;
