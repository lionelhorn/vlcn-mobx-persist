export interface IUserResponse {
  results: IUser[];
  info: IUserResponseInfo;
}

export interface IUser {
  email: string;
  name: IUserName;
  location: IUserLocation;
  dob: IUserDob;
  picture: IPicture;
}

export interface IUserName {
  title: string;
  first: string;
  last: string;
}

export interface IUserLocation {
  city: string;
  country: string;
}

export interface IUserDob {
  age: number;
  date: string;
}

export interface IPicture {
  large: string;
  medium: string;
  thumbnail: string;
}

export interface IUserResponseInfo {
  seed: string;
  results: number;
  page: number;
  version: string;
}
