import User from "../../../DB/models/user.model.js";
import { sendEmailService } from "../../services/send-email.service.js";
import { ErrorHandler } from "../../utils/error-class.utils.js";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";

// ================= Sign Up =================
export const signup = async (req, res, next) => {
  // destruct data
  const {
    firstName,
    lastName,
    email,
    password,
    recoveryEmail,
    DOB,
    mobileNumber,
    role,
  } = req.body;
  // check if email exist
  const isEmailExist = await User.findOne({ email });
  if (isEmailExist) {
    return next(new ErrorHandler("Email already exist", 409));
  }
  // object data
  const user = new User({
    firstName,
    lastName,
    username: `${firstName} ${lastName}`,
    email,
    password: hashSync(password, +process.env.SALT_ROUND),
    recoveryEmail,
    DOB,
    mobileNumber,
    role,
  });
  // generate token for _id
  const token = jwt.sign(
    { userId: user._id },
    process.env.CONFIRMATION_TOKEN_FOR_EMAIL,
    {
      expiresIn: "1h",
    }
  );
  // generate email confirmation link
  const confirmationLink = `${req.protocol}://${req.headers.host}/users/verify-email?${token}`;
  // sending email
  const isEmailSent = sendEmailService({
    to: email,
    subject: "Welcome to search app",
    htmlMessage: `<h1><a href=${confirmationLink}>Please verify your email address</a></h1>`,
  });
  // check if email sent
  if (isEmailSent?.rejected?.length)
    return next(new ErrorHandler("Verification Email Failed sending ", 500));

  // create user
  await user.save();
  res.status(201).json({ message: "User created successfully", user });
};

// ================= verify Email =================
export const verifyEmail = async (req, res, next) => {
  const { token } = req.params;
  const data = jwt.verify(token, process.env.CONFIRMATION_TOKEN_FOR_EMAIL);
  const confirmedUser = await User.findOneAndUpdate(
    { _id: data?.userId, isConfirmed: false },
    { isConfirmed: true },
    { new: true }
  );
  if (!confirmedUser) return next(new ErrorHandler("User not found", 404));
  res
    .status(200)
    .json({ message: "User verified successfully", confirmedUser });
};
// ================= Sign In =================
export const signin = async (req, res, next) => {
  // destruct data
  const { emailOrmobileNumber, password } = req.body;
  // find user
  const user = await User.findOne({
    $or: [
      { email: emailOrmobileNumber },
      { mobileNumber: emailOrmobileNumber },
    ],
  });
  // check user
  if (!user)
    return next(
      new ErrorHandler(
        "message: 'Invalid email/mobile number or password'",
        401
      )
    );
  // check password
  const checkPassword = compareSync(password, user.password);
  if (!checkPassword)
    return next(
      new ErrorHandler(
        "message: 'Invalid email/mobile number or password'",
        401
      )
    );

  // change user state
  if (user !== null) {
    user.status = "online";
    await user.save();
  } else {
    return next(new ErrorHandler("message: 'User not found'", 404));
  }

  // Generate user token
  const token = jwt.sign(
    { userId: user?._id, email: user?.email },
    process.env.LOGIN_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({ message: "Logged in successfully", token });
};
// ================= update account =================
export const updateAccount = async (req, res, next) => {
  // destruct data
  const { email, mobileNumber, recoveryEmail, DOB, firstName, lastName } =
    req.body;
  const { _id } = req.authUser;
  // find user
  const user = await User.findById(_id);
  // check user
  if (!user) return next(new ErrorHandler("User not found", 404));
  // check email
  if (email) {
    const existingUser = await User.findOne({ email: email });
    if (existingUser && existingUser._id.toString() !== _id) {
      return next(new ErrorHandler("Email already in use", 400));
    }
  }
  // check mobile
  if (mobileNumber) {
    const existingUser = await User.findOne({ mobileNumber: mobileNumber });
    if (existingUser && existingUser._id.toString() !== _id) {
      return next(new ErrorHandler("Mobile number already in use", 400));
    }
  }

  // updating data
  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.email = email || user.email;
  user.recoveryEmail = recoveryEmail || user.recoveryEmail;
  user.DOB = DOB || user.DOB;
  user.mobileNumber = mobileNumber || user.mobileNumber;

  // generate token for _id
  const token = jwt.sign(
    { userId: user._id },
    process.env.SECRET_UPDATE_EMAIL,
    {
      expiresIn: "1h",
    }
  );
  // generate email confirmation link
  const confirmationLink = `${req.protocol}://${req.headers.host}/users/verify-email?${token}`;
  // sending email
  const isEmailSent = sendEmailService({
    to: email,
    subject: "Welcome to your new Email",
    htmlMessage: `<h1><a href=${confirmationLink}>Please verify your new Email</a></h1>`,
  });
  // check if email sent
  if (isEmailSent?.rejected?.length)
    return next(new ErrorHandler("Verification Email Failed sending ", 500));

  await user.save();
  res.status(200).json({ message: "Account updated successfully" });
};
// ================= delete account =================
export const deleteAccount = async (req, res, next) => {
  // destruct data
  const { _id } = req.authUser;
  // find user to delete it
  const deleteAccount = await User.findByIdAndDelete(_id);
  // check if Delete Failed
  if (!deleteAccount) return next(new ErrorHandler("Delete Failed", 400));
  res.status(200).json({ message: "Delete success" });
};
// ================= Get user account data =================
export const userAccountData = async (req, res, next) => {
  // destruct data
  const { _id } = req.authUser;
  // find user
  const user = await User.findById(_id);
  // check if user not exist
  if (!user) return next(new ErrorHandler("User not found", 404));
  // The data that will be returned
  const userData = {
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    recoveryEmail: user.recoveryEmail,
    DOB: user.DOB,
    mobileNumber: user.mobileNumber,
    role: user.role,
    status: user.status,
  };
  res.status(200).json({ userData });
};
// ================= Get profile data for another user  =================
export const profileData = async (req, res, next) => {
  // destruct data
  const { _id } = req.authUser;
  const { userId } = req.params;
  // find user by id
  const login = await User.findById(_id);
  //check if not login
  if (!login) return next(new ErrorHandler("You are not login", 401));
  // find another user
  const profileUser = await User.findById(userId);
  // check if another user found
  if (!profileUser) return next(new ErrorHandler("User not found", 404));
  // another profile data
  const profileUserData = {
    username: profileUser.username,
    bithday: profileUser.DOB,
    phone: profileUser.mobileNumber,
    status: profileUser.status,
  };
  res.status(200).json(profileUserData);
};

// ================= Update password =================
export const updatePassword = async (req, res, next) => {
  // destruct data
  const { _id } = req.authUser;
  const { oldPassword, newPassword } = req.body;
  // find user
  const user = await User.findById(_id);
  // check user if not exist
  if (!user) return next(new ErrorHandler("User not found", 404));
  // check old password
  if (!compareSync(oldPassword, user.password))
    return next(new ErrorHandler("Invalid current password", 400));
  // Hash the new password
  const hashedPassword = hashSync(newPassword, +process.env.SALT_ROUND);
  // Update the user's password
  user.password = hashedPassword;
  await user.save();
  res.status(200).json({ message: "Password updated successfully" });
};
// ================= Forget password =================
export const forgetPassword = async (req, res, next) => {
  // destruct data
  const { email } = req.body;
  // find user by email
  const user = await User.findOne({ email });
  // check if email exist
  if (!user) return next(new ErrorHandler("User not found", 404));
  // generate random password
  const otp = otpGenerator.generate(17, {
    digits: true,
    alphabets: true,
    upperCase: true,
    specialChars: true,
  });

  user.otp = otp;
  // OTP valid for 1 hour
  user.otpExpiration = Date.now() + 3600000;
  // send new password to email
  const isEmailSent = sendEmailService({
    to: email,
    subject: "The new Password",
    htmlMessage: `<h1> Your password reset is: ${otp} </h1>`,
  });
  // check if email sent
  if (isEmailSent?.rejected?.length)
    return next(
      new ErrorHandler("Failed sending new password to your email", 500)
    );

  await user.save();
  res.status(200).json({ message: "new Password sent your email" });
};
// ================= Get all accounts associated to a specific recovery Email  =================
export const recoveryEmail = async (req, res, next) => {
  // destruct data
  const { recoveryEmail } = req.params;
  // find the users
  const users = await User.find({ recoveryEmail }).select(
    "-_id -password -__v -isConfirmed"
  );
  // check if users exist
  if (!users) return next(new ErrorHandler("Somthing went wrong", 400));
  res.status(200).json(users);
};
