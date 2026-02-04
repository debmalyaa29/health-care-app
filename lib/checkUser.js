import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  console.log("Checking user whether exist.... 💕💕💕💕💕");
  let user = null;
  try {
    user = await currentUser();
  } catch (err) {
    console.error('Error fetching current user from Clerk:', err);
    return null;
  }
  // console.log('Current user is : ' , user)
  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
      include: {
        transactions: {
          where: {
            type: "CREDIT_PURCHASE",
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });
    console.log("User is already logged in.... ✅✅");
    if (loggedInUser) {
      return loggedInUser;
    }
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    console.log("User not found, creating new user...❌❌ ", user.firstName);
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name: name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        transactions: {
          create: {
            type: "CREDIT_PURCHASE",
            packageId: "free_user",
            amount: 2,
          },
        },
      },
    });
    console.log("User created successsfully...");
    return newUser;
  } catch (error) {
    console.log(error);
  }
};
