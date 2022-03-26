import expressLoader from "./express";

export default async ({ expressApp }: any) => {
  await expressLoader({ app: expressApp });
};
