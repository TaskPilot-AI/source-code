import { PrismaClient } from "@prisma/client";
import { compare, hash } from "../utils/scrypt";
import { PricingPlans } from "../utils/plans";

const prisma = new PrismaClient();
export const createAdmin = async (
  name: string,
  email: string,
  accessToken: string = "",
  password?: string
) => {
  // Check if user exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    if (password && (!existingAdmin.password || existingAdmin.password === "")) {
      const hashedPassword = await hash(password);
      await prisma.admin.update({
        where: { id: existingAdmin.id },
        data: { password: hashedPassword },
      });
    }
    // Remove password from returned admin object
    const { password: _, ...adminWithoutPassword } = existingAdmin;

    return adminWithoutPassword;
  }

  // Find free plan
  const freePlan = PricingPlans.find((plan) => plan.id === "free");
  if (!freePlan) {
    throw new Error("Free plan not found in PricingPlans");
  }

  // Set subscription dates
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 100); // Very long expiration for free plan

  const hashedPassword = password ? await hash(password) : "";

  try {
    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx: any) => {
      // Create admin first with free plan limits
      const admin = await tx.admin.create({
        data: {
          name,
          email,
          password: hashedPassword,
          accessToken,
          role: "admin",
          remainginEmployeeLimit: freePlan.employeeLimit, // Fixed typo
          remainingDocumentLimit: freePlan.documentLimit,
          remainingProjectLimit: freePlan.projectLimit,
          remainingResearchLimit: freePlan.researchLimit,
          dailyResearchLimit: getPlanDailyResearchLimit("free"),
        },
      });

      // Create subscription with reference to admin
      const subscription = await tx.subscription.create({
        data: {
          planId: "free",
          status: "active",
          startDate,
          endDate,
          adminId: admin.id,
        },
      });

      // Update admin with subscription ID
      const updatedAdmin = await tx.admin.update({
        where: { id: admin.id },
        data: {
          subscriptionId: subscription.id,
        },
      });

      return updatedAdmin;
    });

    // Remove password from returned admin object
    const { password: _, ...adminWithoutPassword } = result;

    return adminWithoutPassword;
  } catch (error) {
    console.error("Error creating admin with free plan:", error);
    throw error;
  }
};

/**
 * Helper function to get daily research limit based on plan ID
 */
function getPlanDailyResearchLimit(planId: string): number {
  switch (planId) {
    case "free":
      return 3;
    case "pro":
      return 1000; // High number for "unlimited"
    case "enterprise":
      return 5000; // Higher number for enterprise
    default:
      return 3; // Default to lowest tier
  }
}
export const login = async (email: string, password: string) => {
  const user = await prisma.admin.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (!user.password || user.password === "") {
    throw new Error("Invalid credentials");
  }

  const passwordMatch = await compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid credentials");
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const findUserById = async (id: string) => {
  const user = await prisma.admin.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      subscription: true,
      password: false,
      remainginEmployeeLimit: true,
      remainingDocumentLimit: true,
      remainingProjectLimit: true,
      remainingResearchLimit: true,
      dailyResearchLimit: true,
      lastLimitResetDate: true,
    },
  });

  const subscription = await prisma.subscription.findFirst({
    where: { adminId: id },
    select: {
      id: true,
      planId: true,
      status: true,
      startDate: true,
      endDate: true,
    },
  });

  return {
    ...user,
    subscription: {
      ...subscription,
      plan: PricingPlans.find((plan) => plan.id === subscription?.planId),
    },
  };
};
