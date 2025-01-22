import CatchAsync from "../utils/CatchAsync.js";
import bcrypt from 'bcrypt';
import prisma from "../db/db.config.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const register = CatchAsync(async (req, res, next) => {
  const { email, name, password, confirmPassword } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  user.authtoken = signToken(user.id);

  res.status(200).json(user);
});

export const signIn = CatchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    console.log(email);

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      }
    });

    if (!user || !user?.password) {
      throw new AppError("Invalid credentials", 401);
    }

    const isCorrectPassword = await bcrypt.compare(
      password,
      user.password
    )

    if (!isCorrectPassword) {
      throw new AppError("Invalid credentials", 401);
    }

    user.authtoken = signToken(user.id);

    res.status(200).json(user);
});

export const oAuthSignIn = CatchAsync(async (req, res, next) => {
    const { email, name, image, account } = req.body;

    // Enhanced validation
    if (!email || !account) {
      throw new AppError("Missing required OAuth credentials", 400);
    }

    console.log(req.body);

    if (!account.provider || !account.providerAccountId) {
      throw new AppError("Invalid account data", 400);
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        image,
        accounts: {
          upsert: {
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
            create: account,
            update: account,
          },
        }
      },
      create: {
        email,
        name,
        image,
        emailVerified: new Date(),
        accounts: {
          create: account,
        },
      },
      include: {
        accounts: true,
      },
    }).catch(error => {
      console.error("Error during upsert:", error);
      throw new AppError("Failed to process OAuth sign-in", 500);
    });

    user.authtoken = signToken(user.id);

    res.json(user);
});

export const getUserByEmail = CatchAsync(async (req, res, next) => {
    const { email } = req.params;
    let user = await prisma.user.findUnique({
        where: { email },
        include: {
            accounts: true,
        },
    });

    // if(user.accounts.length > 0) {
    //   const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo`, {
    //     headers: {
    //       Authorization: `Bearer ${user.accounts[0].access_token}`,
    //     },
    //   });

    //   console.log(user.accounts)

    //   const userData = await response.json();

    //   if(userData.picture != user.image || userData.name != user.name) {
    //       user = await prisma.user.update({
    //           where: { email },
    //           data: {
    //               name: userData.name,
    //               image: userData.picture,
    //           }
    //       });
    //   }
    // }

    console.log(user);

    if(!user) {
        throw new AppError("User not found", 404);
    }

    res.status(200).json(user);
});



//   async function refreshAccessToken() {
//     try {
//       // Replace this with the actual refresh token from your database
//       const refreshToken = "1//0gEm3udfh2E6ICgYIARAAGBASNwF-L9IrR7wi_idfENDQhvpKp7DNqvYUh23MrZYbMOTbkNeg_LpXxF8SsqBFVlKwq11AWQD_VyI";

//       // Construct the URL to get the new access token using the refresh token
//       const url = `https://oauth2.googleapis.com/token?client_id=${process.env.AUTH_GOOGLE_ID}&client_secret=${process.env.AUTH_GOOGLE_SECRET}&grant_type=refresh_token&refresh_token=${refreshToken}`;

//       const response = await fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       });

//       const refreshedTokens = await response.json();

//       if (!response.ok) {
//         throw refreshedTokens; // Throw the error returned from Google API
//       }

//       // Return the new access token
//       return refreshedTokens.access_token;
//     } catch (error) {
//       console.error("Failed to refresh access token:", error);
//       return null;
//     }
//   }
