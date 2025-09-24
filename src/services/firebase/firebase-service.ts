import { API_BASE_URI } from "@/src/config/app-config";
import { fetchWithTimeout } from "@/src/utils/utils";

interface ImageUploadResponse{
    url:string,
    path:string
}

export const firebaseUploadImage = async (filePath: string, folder?: string): Promise<ImageUploadResponse> => {
    try {
        const formData = new FormData();
        formData.append("file", {
            uri: filePath,
            name: filePath.split("/").pop() || `upload_${Date.now()}.jpg`,
            type: "image/jpeg",
        } as any);

        if (folder) {
            formData.append("folder", folder);
        }
        const uploadImageResponse=await fetchWithTimeout({
            url:`${API_BASE_URI}/files/upload`,
            options: {
                method: 'POST',
                body: formData
            }
        })
        return uploadImageResponse
    }
    catch (error) {
        return {url:"",path:""}
    }

}