import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a base64 image string to Cloudinary.
 * @param fileBase64 The base64 string of the image
 * @param folder The folder to store it in
 * @returns The secure URL of the uploaded image
 */
export async function uploadToCloudinary(fileBase64: string, folder: string = "techexotica_profiles"): Promise<string> {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            fileBase64,
            {
                folder,
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    reject(error);
                } else {
                    resolve(result?.secure_url || "");
                }
            }
        );
    });
}
