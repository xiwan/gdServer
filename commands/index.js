module.exports = {


  showRoutes: function (done) {
    console.log(sails.config.routes);
    console.log();
    done();
  },
  
}