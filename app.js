var Sequelize = require('sequelize')
var sequelize = new Sequelize('test', 'root', null, { dialect: 'mysql', host: 'localhost', define: { timestamps: true } })

// Models
var Election = sequelize.define('Election', {
  name: Sequelize.STRING
})
var User = sequelize.define('User', {
  name: Sequelize.STRING
})

// Associations
Election.belongsTo(User)
Election.hasMany(User, { as: 'Voters', through: 'ElectionsVotes' })
User.hasMany(Election)
User.hasMany(Election, { as: 'Votes', through: 'ElectionsVotes' })

sequelize.sync().complete(function (err) {
  if (err) {
    throw err
  } else {
    
  // Add some data
  User.create({ name: 'Alice' }).success(function (alice) {
    User.create({ name: 'Bob' }).success(function (bob) {
      Election.create({ name: 'Some election' }).success(function (election) {
        election.setUser(alice).success(function () {
          election.setVoters([alice, bob]).success(function () {
            
            // Run a query
            var criteria = {
              offset: 3, // changing this from to, say, 5 has no effect
              limit: 1,
              include: [
                User, // Election creator
                { model: User, as: 'Voters' } // Election voters
              ]
            }
            Election.findAndCountAll(criteria).success(function (elections) {
              console.log('Election count:', elections.count)
              for (var i = 0; i < elections.rows.length; i++) {
                console.log('Found Election: id', elections.rows[i].id)
              }
            }).error(function (error) {
              console.log('Error', error)
            })
            
          })
        })
      })
    })
  })
  
  }
})