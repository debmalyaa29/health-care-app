"use server"
import { VerificationStatus } from "@/lib/generated/prisma/enums";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

//checking the role of the user
export async function setUserRole(formData){
    const {userId} = await auth();

    if(!userId){
        throw new Error("Unauthorized")
    }
    //find user in our database
    const user = await db.user.findUnique({
        where:{clerkUserId:userId},
    })

    if(!user) throw new Error("User not found in the database")

   const role = formData.get("role");

   if(!role || !["PATIENT","DOCTOR"].includes(role)){
    throw new Error("Invalid role selection");
   }

   try {
    if(role === "PATIENT"){
        await db.user.update({
            where:{
                clerkUserId:userId,
            },
            data:{
                role:"PATIENT",
            }
        })
        revalidatePath("/");
        return {success:true,redirect:"/doctors"}
    }
    if(role ==="DOCTOR"){
        //formdata in the DOCTOR ROLE
        const speciality= formData.get("speciality")
        const experiance = parseInt(formData.get("experiance"),10);
        const credentialUrl =formData.get("credentialUrl")
        const description = formData.get("description");

        if(!speciality || !experiance || !credentialUrl || !description){
            throw new Error ("All fields are required")
        }
    
    await db.user.update({
       where:{
        clerkUserId:userId
       },
       data:{
        role:"DOCTOR",
        speciality,
        experiance,
        credentialUrl,
        description,
        verificationStatus:"PENDING"
       }
    })
    revalidatePath("/");
    return {success:true,redirect:"/doctor/verification"}
}
   } catch (error) {
    console.log("Failed to set user role:",error);
    throw new Error (`Failed:${error.message}`)
   }
}

//get the current user's complete profille information
export async function getCurrentUser(){
     const { userId } = await auth();

       if (!userId) {
    return null;
  }
   try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    return user;
  } catch (error) {
    console.error("Failed to get user information:", error);
    return null;
  }
}