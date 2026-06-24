"use server"
import prisma from "@/app/lib/prisma";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function checkuser(email) {
    const session = await getServerSession(authOptions);
    if (!email || !session?.user?.email) return false;
    return session.user.email.trim().toLowerCase() === decodeURIComponent(email).trim().toLowerCase();
}

export async function updateprofilepic(imageUrl, emailofuser) {
    // udation logic in prisma
    const updateuser = await prisma.users.update({
        where: { email: emailofuser },
        data: { profile_image: imageUrl },
    })

    return {status: 200};

}


export async function getUser(email){
    const decoded_email = decodeURIComponent(email).trim();
    const user = await prisma.users.findUnique({
        where: {email: decoded_email},
        select: {name: true,email:true,created_at: true,profile_image:true,about:true}
    })

    return user;
}

export async function updateUserProfile(emailofuser, name, about) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return { status: 401, error: "Unauthorized" };
    }

    const email = decodeURIComponent(emailofuser).trim().toLowerCase();
    const sessionEmail = session.user.email.trim().toLowerCase();

    if (email !== sessionEmail) {
        return { status: 403, error: "Forbidden: You cannot edit another user's profile" };
    }

    try {
        const updatedUser = await prisma.users.update({
            where: { email: email },
            data: { 
                name: name ? name.trim() : null, 
                about: about ? about.trim() : null 
            },
        });
        return { status: 200, user: { name: updatedUser.name, about: updatedUser.about } };
    } catch (err) {
        console.error("Error updating profile in db:", err);
        return { status: 500, error: "Failed to update profile in database" };
    }
}