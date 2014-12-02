module.exports = exports = function facebook_oauth2_plugin (schema, options) {

  schema.add({
    auth_type_facebook: {
      id: {type: String},
      gender: {type: String},
      profileUrl: {type: String},
      picture: {type: String},
      oauth_token: {type: String},
      oauth_token_secret: {type: String}
    }
  });

  schema.methods.setFacebookAttr = function(_json, token, tokenSecret) {
    this.set({
      'auth_provider': 'facebook',
      'uid': '_facebook_' + _json.id,
      'email': _json.email,
      'display_name': _json.name,
      'auth_type_facebook.id': _json.id,
      'auth_type_facebook.username': _json.username,
      'auth_type_facebook.profileUrl': _json.link,
      'auth_type_facebook.picture': 'https://graph.facebook.com/' + _json.id +   '/picture?width=227&height=227',
      'auth_type_facebook.gender': _json.gender,
      'auth_type_facebook.oauth_token': token,
      'auth_type_facebook.oauth_token_secret': tokenSecret
    });
  };

  schema.static('findOrCreateFacebookUser', function (token, tokenSecret, profile, done) {
    var User = this;
    User.findOne({ 'auth_type_facebook.id': profile.id }, function(err, user){
      if (err) { return done(err); }

      if (user) {
        return done(null, user);
      } else {
        var j = profile._json;
        var gUser = new User();
        gUser.setFacebookAttr(j, token, tokenSecret);
        gUser.save(function(err, user){
          if (err) {return done(err);}
          return done(null, user);
        });
      }

    });
  });

};
