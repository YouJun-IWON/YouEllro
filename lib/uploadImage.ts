import { ID, storage} from "@/appwrite";

const uploadImage = async (file: File) => {
  if (!file) return;


  const fileUploaded = await storage.createFile(
    "6501076c5c81ad84c717",
    ID.unique(),
    file
  )

  return fileUploaded;
};

export default uploadImage;