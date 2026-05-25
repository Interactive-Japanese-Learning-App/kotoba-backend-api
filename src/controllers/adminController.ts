// import { Request, Response } from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// import Admin from "../models/Admin";

// import {
//   emailRegex,
//   passwordRegex,
// } from "../utils/validators";

// //
// // REGISTER ADMIN
// //
// export const registerAdmin = async (
//   req: Request,
//   res: Response
// ) => {
//   try {

//     const { email, password } =
//       req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Email and password are required",
//       });
//     }

//     if (!emailRegex.test(email)) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Invalid email format",
//       });
//     }

//     if (!passwordRegex.test(password)) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Password must contain uppercase, lowercase, number, symbol and minimum 8 characters",
//       });
//     }

//     const existingAdmin =
//       await Admin.findOne({ email });

//     if (existingAdmin) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Admin already exists",
//       });
//     }

//     const hashedPassword =
//       await bcrypt.hash(password, 10);

//     const admin = await Admin.create({
//       email,
//       password: hashedPassword,
//     });

//     res.status(201).json({
//       success: true,
//       message:
//         "Register success",
//       admin,
//     });

//   } catch (error) {

//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });

//   }
// };

// //
// // LOGIN ADMIN
// //
// export const loginAdmin = async (
//   req: Request,
//   res: Response
// ) => {
//   try {

//     const { email, password } =
//       req.body;

//     const admin =
//       await Admin.findOne({ email });

//     if (!admin) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Admin not found",
//       });
//     }

//     const isMatch =
//       await bcrypt.compare(
//         password,
//         admin.password
//       );

//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message:
//           "Invalid credentials",
//       });
//     }

//     const token = jwt.sign(
//       {
//         id: admin._id,
//         role: "admin",
//       },
//       process.env.JWT_SECRET!,
//       {
//         expiresIn: "7d",
//       }
//     );

//     res.status(200).json({
//       success: true,
//       token,
//       admin: {
//         _id: admin._id,
//         email: admin.email,
//       },
//     });

//   } catch (error) {

//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message:
//         "Server error",
//     });

//   }
// };

// //
// // GET ALL ADMINS
// //
// export const getAdmins = async (
//   req: Request,
//   res: Response
// ) => {
//   try {

//     const admins =
//       await Admin.find()
//         .select("-password");

//     res.status(200).json({
//       success: true,
//       total: admins.length,
//       admins,
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message:
//         "Server error",
//     });

//   }
// };