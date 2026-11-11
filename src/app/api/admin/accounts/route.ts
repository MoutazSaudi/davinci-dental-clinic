export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import {
  requireAdminRoleApi,
  createPasswordRecord,
  ALL_PERMISSIONS,
  type AdminPermission,
} from "@/lib/auth";

/* ─────────── Validation schemas ─────────── */
/* Error messages are i18n KEYS (prefixed with "error").           */
/* The client form translates them via t.accounts[errorKey].       */

const permissionSchema = z.enum([
  "OVERVIEW",
  "APPOINTMENTS",
  "MESSAGES",
  "DOCTORS",
  "GALLERY",
  "FAQ",
  "SERVICES",
]);

const createSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "errorUsernameMin")
    .max(50, "errorUsernameMax")
    .regex(/^[a-z0-9_-]+$/i, "errorUsernameFormat")
    .refine((v) => !v.includes("@"), "errorUsernameEmail"),
  name: z
    .string()
    .trim()
    .max(100, "errorNameMax")
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, "errorPasswordLength")
    .max(200, "errorPasswordMax"),
  role: z.enum(["ADMIN", "EDITOR"]),
  permissions: z.array(permissionSchema).default([]),
});

const updateSchema = z.object({
  name: z
    .string()
    .trim()
    .max(100, "errorNameMax")
    .optional()
    .or(z.literal("")),
  role: z.enum(["ADMIN", "EDITOR"]).optional(),
  permissions: z.array(permissionSchema).optional(),
  isActive: z.boolean().optional(),
  newPassword: z
    .string()
    .min(8, "errorPasswordLength")
    .max(200, "errorPasswordMax")
    .optional(),
});

type Row = {
  id: string;
  username: string;
  name: string | null;
  role: string;
  permissions: string[];
  isActive: boolean;
  mustChangePassword: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
};

function serialize(u: Row) {
  return {
    id: u.id,
    username: u.username,
    name: u.name,
    role: u.role,
    permissions: u.permissions,
    isActive: u.isActive,
    mustChangePassword: u.mustChangePassword,
    lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
    createdAt: u.createdAt.toISOString(),
  };
}

/* ─────────── GET: list all accounts ─────────── */

export async function GET() {
  const auth = await requireAdminRoleApi();
  if (auth instanceof NextResponse) return auth;

  const users = await prisma.adminUser.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json(users.map(serialize));
}

/* ─────────── POST: create a new account ─────────── */

export async function POST(req: Request) {
  const auth = await requireAdminRoleApi();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const payload = createSchema.parse(body);
    const username = payload.username.toLowerCase();

    // Business rule: Editor must have at least one permission
    if (payload.role === "EDITOR" && payload.permissions.length === 0) {
      return NextResponse.json(
        {
          error: "invalid_input",
          details: { permissions: ["errorPermissionRequired"] },
        },
        { status: 400 }
      );
    }

    const existing = await prisma.adminUser.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json(
        { error: "username_taken" },
        { status: 409 }
      );
    }

    const effectivePermissions: AdminPermission[] =
      payload.role === "ADMIN"
        ? ALL_PERMISSIONS
        : (payload.permissions as AdminPermission[]);

    const user = await prisma.adminUser.create({
      data: {
        username,
        name: payload.name || null,
        passwordHash: createPasswordRecord(payload.password),
        role: payload.role,
        permissions: effectivePermissions,
        isActive: true,
        mustChangePassword: true,
        createdById: auth.user.id,
      },
    });

    return NextResponse.json(serialize(user), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "invalid_input", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Unable to create account" },
      { status: 500 }
    );
  }
}

/* ─────────── PATCH: update an account ─────────── */

export async function PATCH(req: Request) {
  const auth = await requireAdminRoleApi();
  if (auth instanceof NextResponse) return auth;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const payload = updateSchema.parse(body);

    const target = await prisma.adminUser.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const isSelf = target.id === auth.user.id;

    if (isSelf && payload.role === "EDITOR") {
      return NextResponse.json(
        { error: "cannot_demote_self" },
        { status: 400 }
      );
    }

    if (isSelf && payload.isActive === false) {
      return NextResponse.json(
        { error: "cannot_deactivate_self" },
        { status: 400 }
      );
    }

    if (
      target.role === "ADMIN" &&
      (payload.role === "EDITOR" || payload.isActive === false)
    ) {
      const otherActiveAdmins = await prisma.adminUser.count({
        where: {
          role: "ADMIN",
          isActive: true,
          id: { not: target.id },
        },
      });
      if (otherActiveAdmins === 0) {
        return NextResponse.json(
          { error: "last_admin_protected" },
          { status: 400 }
        );
      }
    }

    // Business rule: an Editor cannot be left with zero permissions
    // (only enforced when permissions are explicitly being updated)
    const effectiveRole = payload.role ?? target.role;
    if (
      effectiveRole === "EDITOR" &&
      payload.permissions !== undefined &&
      payload.permissions.length === 0
    ) {
      return NextResponse.json(
        {
          error: "invalid_input",
          details: { permissions: ["errorPermissionRequired"] },
        },
        { status: 400 }
      );
    }

    const data: Record<string, unknown> = {};
    if (payload.name !== undefined) data.name = payload.name || null;
    if (payload.role !== undefined) data.role = payload.role;
    if (payload.isActive !== undefined) data.isActive = payload.isActive;
    if (payload.permissions !== undefined) {
      data.permissions =
        effectiveRole === "ADMIN"
          ? ALL_PERMISSIONS
          : (payload.permissions as AdminPermission[]);
    }
    if (payload.newPassword) {
      data.passwordHash = createPasswordRecord(payload.newPassword);
      data.mustChangePassword = true;
    }

    const updated = await prisma.adminUser.update({ where: { id }, data });
    return NextResponse.json(serialize(updated));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "invalid_input", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Unable to update account" },
      { status: 500 }
    );
  }
}

/* ─────────── DELETE: remove an account ─────────── */

export async function DELETE(req: Request) {
  const auth = await requireAdminRoleApi();
  if (auth instanceof NextResponse) return auth;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  if (id === auth.user.id) {
    return NextResponse.json(
      { error: "cannot_delete_self" },
      { status: 400 }
    );
  }

  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (!target) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (target.role === "ADMIN") {
    const otherActiveAdmins = await prisma.adminUser.count({
      where: {
        role: "ADMIN",
        isActive: true,
        id: { not: target.id },
      },
    });
    if (otherActiveAdmins === 0) {
      return NextResponse.json(
        { error: "last_admin_protected" },
        { status: 400 }
      );
    }
  }

  await prisma.adminUser.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}