import { VerificationStatus } from "@/lib/generated/prisma/enums";
import { db } from "@/lib/prisma";


export async function getDoctorBySpeciality(speciality){
    try {
        const doctors =await db.user.findMany({
            where:{
                role:"DOCTOR",
                verificationStatus:"VERIFIED",
                speciality:speciality
            },
            orderBy:{
                name:"asc"
            }
        })

        return {doctors}
    } catch (error) {
        console.error("Failed to fetch docotrs by speciality",error)
        return {error:"Failed to fetch docotrs"}
    }
}