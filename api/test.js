const ratings = require('./models/ratings')

ratings.create({
    team : 'SK Team',
    game : 'sc2',
    rating : '2300'
})
.then(data => {
    console.log(data)
})