/**
 * @fileoverview PrismaClient singleton with soft-delete query interceptors.
 * @org GBN Polytechnic
 * @license ISC
 */

import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Set of Prisma model names that support soft-delete via the `deletedAt` column.
 * Queries on these models are automatically intercepted to filter or update accordingly.
 */
const SOFT_DELETE_MODELS = new Set([
  "AdminUser",

  "Department",
  "Faculty",
  "Lab",
  "Course",
  "StudyMaterial",
  "AcademicDocument",
  "NewsNotice",
  "Event",
  "GalleryAlbum",
  "HeroSlide",
  "ResultLink",
  "PlacementCompany",
  "PlacementActivity",
  "MoU",
  "Achievement",
]);

/**
 * Checks whether the given model name is in the soft-delete set.
 * @param model - Prisma model name.
 * @returns True if the model supports soft-delete.
 */
function isSoftDeleteModel(model?: string): boolean {
  return !!model && SOFT_DELETE_MODELS.has(model);
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

/**
 * Creates a PrismaClient instance extended with soft-delete query interceptors.
 * Find queries on soft-delete models automatically exclude records where `deletedAt` is set.
 * Delete operations on soft-delete models set `deletedAt` instead of removing the record.
 * @returns Extended PrismaClient instance with soft-delete behavior.
 */
function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const base = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["warn", "error"],
  });

  const extended = base.$extends({
    query: {
      $allModels: {
        async findMany({ model, args, query }) {
          if (isSoftDeleteModel(model)) {
            args.where = { ...(args.where ?? {}), deletedAt: null };
          }
          return query(args);
        },
        async findFirst({ model, args, query }) {
          if (isSoftDeleteModel(model)) {
            args.where = { ...(args.where ?? {}), deletedAt: null };
          }
          return query(args);
        },
        async findUnique({ model, args, query }) {
          if (isSoftDeleteModel(model)) {
            args.where = { ...args.where, deletedAt: null };
          }
          return query(args);
        },
        async findUniqueOrThrow({ model, args, query }) {
          if (isSoftDeleteModel(model)) {
            args.where = { ...args.where, deletedAt: null };
          }
          return query(args);
        },
        async delete({ model, args, query }) {
          if (isSoftDeleteModel(model)) {
            const modelKey = (model[0].toLowerCase() + model.slice(1)) as Uncapitalize<Prisma.ModelName>;
            const delegate = base[modelKey as keyof PrismaClient] as unknown as {
              update: (input: { where: unknown; data: { deletedAt: Date } }) => unknown;
            };
            return delegate.update({
              where: args.where,
              data: { deletedAt: new Date() },
            });
          }
          return query(args);
        },
        async deleteMany({ model, args, query }) {
          if (isSoftDeleteModel(model)) {
            const modelKey = (model[0].toLowerCase() + model.slice(1)) as Uncapitalize<Prisma.ModelName>;
            const delegate = base[modelKey as keyof PrismaClient] as unknown as {
              updateMany: (input: { where?: unknown; data: { deletedAt: Date } }) => unknown;
            };
            return delegate.updateMany({
              where: args.where,
              data: { deletedAt: new Date() },
            });
          }
          return query(args);
        },
      },
    },
  });

  return extended as PrismaClient;
}

/**
 * Singleton PrismaClient instance reused across hot-reloads in development.
 * In production, a fresh instance is created once per process.
 */
const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
