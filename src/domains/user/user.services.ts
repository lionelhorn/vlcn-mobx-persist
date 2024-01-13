import { http } from "../../utils/http/http";
import { IUserResponse } from "./user.types";

export const getUserRequest = async () => {
  const endpoint: string =
    "https://randomuser.me/api/?inc=email,name,picture,dob,location";

  return http.get<IUserResponse>(endpoint);
};
