const mongoose = require('mongoose');
const Joi = require('joi');
const moment = require('moment');
Joi.objectId = require('joi-objectid')(Joi);

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
      },
      lastName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
      },
      email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
      },
      phone: {
        type: String,
        minlength: 3,
        maxlength: 30,
        required: true
      },
      postcode: {
        type: String,
        required: true
      }
    }),
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 255
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
      }
    }),
  required: true
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});

rentalSchema.statics.lookup = function(customerId, movieId) {
  return this.findOne({
    'customer._id': customerId,
    'movie._id': movieId
  });
};

rentalSchema.methods.return = function() {
  this.dateReturned = new Date();

  const rentalDays = moment(this.dateReturned).diff(this.dateOut, 'days');
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('Rental', rentalSchema);

function validationRental (rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  });
  return schema.validate(rental);
}

module.exports.Rental = Rental;
module.exports.validate = validationRental;