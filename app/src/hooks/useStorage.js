import { useEffect, useState } from "react";
import { storage } from "../configs/firebase.config";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import useAuth from "./useAuth";

const useStorage = () => {
  const { user } = useAuth();

  const [file, setFile] = useState(null);
  const [percent, setPercent] = useState(0);
  const [urlImage, setUrlImage] = useState("");

  useEffect(() => {
    if (user) setUrlImage(user.avatar);
  }, [user]);

  const handleChange = async (event) => {
    setFile(event.target.files[0]);
    setUrlImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleUpload = async () => {
    if (!file) return;

    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `/files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          // update progress
          setPercent(percent);
        },
        (err) => {
          console.error("Upload error:", err);
          reject(err);
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);

            setUrlImage(url);
            resolve(url);
          } catch (error) {
            console.error("Error getting download URL:", error);
            reject(error);
          }
        }
      );
    });
  };

  return { handleUpload, setFile, handleChange, urlImage, setUrlImage };
};

export default useStorage;
