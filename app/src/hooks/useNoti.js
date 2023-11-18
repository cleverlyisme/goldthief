import { useState } from "react";

const useNoti = () => {
  const [noti, setNoti] = useState(null);

  return { noti, setNoti };
};

export default useNoti;
