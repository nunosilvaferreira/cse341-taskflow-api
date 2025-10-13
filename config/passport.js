// /config/passport.js
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Google may provide emails
          const email = profile.emails && profile.emails.length ? profile.emails[0].value : null;
          const name = profile.displayName || (profile.name && `${profile.name.givenName} ${profile.name.familyName}`) || 'Google User';

          if (!email) {
            // no email - can't proceed
            return done(null, false, { message: 'No email available from Google' });
          }

          let user = await User.findOne({ email });

          if (!user) {
            // Create new user with random password (will be hashed by pre-save hook)
            const randomPassword = Math.random().toString(36).slice(-10);
            user = await User.create({
              name,
              email,
              password: randomPassword
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  // Not using sessions but passport requires serialize/deserialize
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user)).catch(err => done(err));
  });
};
