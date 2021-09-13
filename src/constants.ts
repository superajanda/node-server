export const NODE_ENV = process.env.NODE_ENV || "production";
export const __prod__ = NODE_ENV === "production";

export const PORT = process.env.PORT || 4000;

export const ERROR_MESSAGES = {
  noHttpAuthHeader: `The 'Authorization' HTTP header wasn't specified`,
  noHttpAuthHeaderPrefix: `The HTTP header 'Authorization' doesn't have a known type as prefix`,
  invalidCredentials: `Your credentials couldn't verified`,
  invalidContentId: `Data with given ID argument couldn't found`,
  invalidRequestBody: `The received HTTP request body format is invalid`,
  emptyRequestBody: `The received HTTP request body format is empty`,
  duplicateEmail: `The entered email address is already being used`,
  unknownError: `An unexpected error occured`,
  unknownRoute: `Requested route not identified`
};
