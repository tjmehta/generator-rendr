module.exports = {
  index: function(params, callback) {
    // var spec = {
    //   collection: {collection: 'Collection', params: params}
    // };
    // this.app.fetch(spec, function(err, result) {
      // callback(err, '<% _.underscored(this.name) %>_index_view', result);
    // });

    callback(err, '<% _.underscored(this.name) %>_index_view', result);
  }
};