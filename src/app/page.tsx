import { db } from "@/prisma/db";

export default async function Home() {
  const data = await db.orm.public.User.all();
  return <div>{JSON.stringify(data)}</div>;
}
