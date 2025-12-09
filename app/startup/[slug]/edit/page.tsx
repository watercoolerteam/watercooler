import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import EditStartupForm from "./edit-form";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditStartupPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Get the startup
  const startup = await prisma.startup.findUnique({
    where: { slug },
  });

  if (!startup || startup.status !== "APPROVED") {
    notFound();
  }

  // Check if user owns this startup
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || startup.claimedBy !== user.id) {
    redirect(`/startup/${slug}`);
  }

  return <EditStartupForm startup={startup} />;
}
