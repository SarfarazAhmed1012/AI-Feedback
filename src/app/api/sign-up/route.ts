import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import VerificationEmail from "../../../../emails/VerificationEmails";
import sendVerificationEmail from "@/helpers/sendVerificationEmails";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "User already exists with given username",
        },
        { status: 400 }
      );
    }

    const existingUser = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUser) {
      if (existingUser.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with given email",
          },
          {
            status: 400,
          }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassword;
        existingUser.verifyCode = verifyCode;
        existingUser.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUser.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        isVerified: false,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    // send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: "Error sending verification email",
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error registering user", error);

    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
