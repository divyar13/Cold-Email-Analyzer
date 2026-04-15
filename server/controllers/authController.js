import jwt from 'jsonwebtoken';
import passport from 'passport';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
});

export const googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err || !user) {
      return res.redirect(`${process.env.CLIENT_URL}/auth/error`);
    }
    const token = generateToken(user._id);
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  })(req, res, next);
};

export const getMe = async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar,
  });
};
