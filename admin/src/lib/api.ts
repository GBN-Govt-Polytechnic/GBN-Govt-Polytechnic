/**
 * @file api.ts
 * @description Typed API client for the GBN backend — handles auth tokens, JSON requests, multipart uploads, and error normalization
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

const IS_SERVER = typeof window === "undefined";
const API_URL = IS_SERVER
  ? (process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api` : "http://localhost:4000/api")
  : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api");

// ─── Token helpers ───

let accessTokenMemory: string | null = null;

export function getAccessToken(): string | null {
  return accessTokenMemory;
}

export function setTokens(access: string) {
  accessTokenMemory = access;
}

export function clearTokens() {
  accessTokenMemory = null;
}

// ─── Error class ───

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

// ─── Core fetch wrapper ───

let isRefreshing = false;
let refreshQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

async function refreshAccessToken(): Promise<string> {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    clearTokens();
    throw new ApiError(401, "Session expired");
  }

  const json = await res.json();
  const { accessToken } = json.data;
  setTokens(accessToken);
  return accessToken;
}

async function getValidToken(): Promise<string | null> {
  const token = getAccessToken();
  if (!token) return null;
  return token;
}

async function handleTokenRefresh(): Promise<string> {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      refreshQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;
  try {
    const newToken = await refreshAccessToken();
    refreshQueue.forEach((q) => q.resolve(newToken));
    return newToken;
  } catch (err) {
    refreshQueue.forEach((q) => q.reject(err));
    throw err;
  } finally {
    isRefreshing = false;
    refreshQueue = [];
  }
}

async function request<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getValidToken();
  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Don't set Content-Type for FormData (browser sets boundary automatically)
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let res = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: "include" });

  // Auto-refresh on 401
  if (res.status === 401 && !path.startsWith("/auth/login") && !path.startsWith("/auth/refresh")) {
    try {
      const newToken = await handleTokenRefresh();
      headers.set("Authorization", `Bearer ${newToken}`);
      res = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: "include" });
    } catch {
      clearTokens();
      if (typeof window !== "undefined") {
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
      throw new ApiError(401, "Session expired");
    }
  }

  if (res.status === 204) return undefined as T;

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      res.status,
      json?.message ?? `Request failed (${res.status})`,
      json?.errors,
    );
  }

  return json as T;
}

// ─── Typed response shapes ───

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

type QueryParams = Record<string, string | number | boolean | undefined>;

function toQuery(params?: QueryParams): string {
  if (!params) return "";
  const entries = Object.entries(params).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return "";
  return "?" + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
}

function formData(data: Record<string, unknown>, fileField?: string, file?: File | null): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null) {
      fd.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
    }
  }
  if (fileField && file) {
    fd.append(fileField, file);
  }
  return fd;
}

// ─── Auth ───

export const auth = {
  login(email: string, password: string) {
    return request<ApiResponse<{ accessToken: string; user: Record<string, unknown> }>>(
      "/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) },
    );
  },

  me() {
    return request<ApiResponse<Record<string, unknown>>>("/auth/me");
  },

  logout() {
    return request("/auth/logout", { method: "POST" });
  },

  changePassword(currentPassword: string, newPassword: string) {
    return request("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

// ─── Dashboard ───

export const dashboard = {
  stats() {
    return request<ApiResponse<Record<string, unknown>>>("/dashboard/stats");
  },
};

// ─── Departments ───

export const departments = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/departments${toQuery(params)}`);
  },
  get(slug: string) {
    return request<ApiResponse<Record<string, unknown>>>(`/departments/${slug}`);
  },
  create(data: Record<string, unknown>) {
    return request<ApiResponse<Record<string, unknown>>>("/departments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update(id: string, data: Record<string, unknown>) {
    return request<ApiResponse<Record<string, unknown>>>(`/departments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  delete(id: string) {
    return request(`/departments/${id}`, { method: "DELETE" });
  },
};

// ─── Faculty ───

export const faculty = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/faculty${toQuery(params)}`);
  },
  get(id: string) {
    return request<ApiResponse<Record<string, unknown>>>(`/faculty/${id}`);
  },
  create(data: Record<string, unknown>, photo?: File | null) {
    return request<ApiResponse<Record<string, unknown>>>("/faculty", {
      method: "POST",
      body: formData(data, "photo", photo),
    });
  },
  update(id: string, data: Record<string, unknown>, photo?: File | null) {
    return request<ApiResponse<Record<string, unknown>>>(`/faculty/${id}`, {
      method: "PUT",
      body: formData(data, "photo", photo),
    });
  },
  delete(id: string) {
    return request(`/faculty/${id}`, { method: "DELETE" });
  },
};

// ─── Users (admin users) ───

export const users = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/users${toQuery(params)}`);
  },
  get(id: string) {
    return request<ApiResponse<Record<string, unknown>>>(`/users/${id}`);
  },
  create(data: Record<string, unknown>) {
    return request<ApiResponse<Record<string, unknown>>>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update(id: string, data: Record<string, unknown>) {
    return request<ApiResponse<Record<string, unknown>>>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  resetPassword(id: string, newPassword: string) {
    return request<ApiResponse<Record<string, unknown>>>(`/users/${id}/password`, {
      method: "PUT",
      body: JSON.stringify({ newPassword }),
    });
  },
  delete(id: string) {
    return request(`/users/${id}`, { method: "DELETE" });
  },
};

// ─── News ───

export const news = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/news${toQuery(params)}`);
  },
  get(id: string) {
    return request<ApiResponse<Record<string, unknown>>>(`/news/${id}`);
  },
  create(data: Record<string, unknown>, image?: File | null, attachment?: File | null) {
    const fd = formData(data, "image", image);
    if (attachment) fd.append("attachment", attachment);
    return request<ApiResponse<Record<string, unknown>>>("/news", { method: "POST", body: fd });
  },
  update(id: string, data: Record<string, unknown>, image?: File | null, attachment?: File | null) {
    const fd = formData(data, "image", image);
    if (attachment) fd.append("attachment", attachment);
    return request<ApiResponse<Record<string, unknown>>>(`/news/${id}`, { method: "PUT", body: fd });
  },
  delete(id: string) {
    return request(`/news/${id}`, { method: "DELETE" });
  },
};

// ─── Events ───

export const events = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/events${toQuery(params)}`);
  },
  get(id: string) {
    return request<ApiResponse<Record<string, unknown>>>(`/events/${id}`);
  },
  create(data: Record<string, unknown>, image?: File | null) {
    return request<ApiResponse<Record<string, unknown>>>("/events", {
      method: "POST",
      body: formData(data, "image", image),
    });
  },
  update(id: string, data: Record<string, unknown>, image?: File | null) {
    return request<ApiResponse<Record<string, unknown>>>(`/events/${id}`, {
      method: "PUT",
      body: formData(data, "image", image),
    });
  },
  delete(id: string) {
    return request(`/events/${id}`, { method: "DELETE" });
  },
};

// ─── Gallery ───

export const gallery = {
  listAlbums(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/gallery${toQuery(params)}`);
  },
  getAlbum(id: string) {
    return request<ApiResponse<Record<string, unknown>>>(`/gallery/${id}`);
  },
  createAlbum(data: Record<string, unknown>) {
    return request<ApiResponse<Record<string, unknown>>>("/gallery", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  updateAlbum(id: string, data: Record<string, unknown>) {
    return request<ApiResponse<Record<string, unknown>>>(`/gallery/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  deleteAlbum(id: string) {
    return request(`/gallery/${id}`, { method: "DELETE" });
  },
  addImages(albumId: string, images: File[]) {
    const fd = new FormData();
    images.forEach((img) => fd.append("images", img));
    return request<ApiResponse<Record<string, unknown>[]>>(`/gallery/${albumId}/images`, {
      method: "POST",
      body: fd,
    });
  },
  deleteImage(imageId: string) {
    return request(`/gallery/images/${imageId}`, { method: "DELETE" });
  },
  updateImageOrder(imageId: string, order: number) {
    return request(`/gallery/images/${imageId}/order`, {
      method: "PUT",
      body: JSON.stringify({ order }),
    });
  },
  setCover(albumId: string, imageId: string) {
    return request<ApiResponse<Record<string, unknown>>>(`/gallery/${albumId}/cover`, {
      method: "PUT",
      body: JSON.stringify({ imageId }),
    });
  },
};

// ─── Hero Slides ───

export const heroSlides = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/hero-slides${toQuery(params)}`);
  },
  get(id: string) {
    return request<ApiResponse<Record<string, unknown>>>(`/hero-slides/${id}`);
  },
  create(data: Record<string, unknown>, image?: File | null) {
    return request<ApiResponse<Record<string, unknown>>>("/hero-slides", {
      method: "POST",
      body: formData(data, "image", image),
    });
  },
  update(id: string, data: Record<string, unknown>, image?: File | null) {
    return request<ApiResponse<Record<string, unknown>>>(`/hero-slides/${id}`, {
      method: "PUT",
      body: formData(data, "image", image),
    });
  },
  delete(id: string) {
    return request(`/hero-slides/${id}`, { method: "DELETE" });
  },
};

// ─── Courses ───

export const courses = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/courses${toQuery(params)}`);
  },
  get(id: string) {
    return request<ApiResponse<Record<string, unknown>>>(`/courses/${id}`);
  },
  create(data: Record<string, unknown>) {
    return request<ApiResponse<Record<string, unknown>>>("/courses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update(id: string, data: Record<string, unknown>) {
    return request<ApiResponse<Record<string, unknown>>>(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  delete(id: string) {
    return request(`/courses/${id}`, { method: "DELETE" });
  },
};

// ─── Labs ───

export const labs = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/labs${toQuery(params)}`);
  },
  get(id: string) {
    return request<ApiResponse<Record<string, unknown>>>(`/labs/${id}`);
  },
  create(data: Record<string, unknown>, image?: File | null) {
    return request<ApiResponse<Record<string, unknown>>>("/labs", {
      method: "POST",
      body: formData(data, "image", image),
    });
  },
  update(id: string, data: Record<string, unknown>, image?: File | null) {
    return request<ApiResponse<Record<string, unknown>>>(`/labs/${id}`, {
      method: "PUT",
      body: formData(data, "image", image),
    });
  },
  delete(id: string) {
    return request(`/labs/${id}`, { method: "DELETE" });
  },
};

// ─── Resources (study materials, lesson plans, syllabus, timetables) ───

function resourceApi(basePath: string) {
  return {
    list(params?: QueryParams) {
      return request<PaginatedResponse<Record<string, unknown>>>(`${basePath}${toQuery(params)}`);
    },
    get(id: string) {
      return request<ApiResponse<Record<string, unknown>>>(`${basePath}/${id}`);
    },
    create(data: Record<string, unknown>, file?: File | null) {
      return request<ApiResponse<Record<string, unknown>>>(basePath, {
        method: "POST",
        body: formData(data, "file", file),
      });
    },
    update(id: string, data: Record<string, unknown>, file?: File | null) {
      return request<ApiResponse<Record<string, unknown>>>(`${basePath}/${id}`, {
        method: "PUT",
        body: formData(data, "file", file),
      });
    },
    delete(id: string) {
      return request(`${basePath}/${id}`, { method: "DELETE" });
    },
  };
}

export const studyMaterials = resourceApi("/study-materials");
export const lessonPlans = resourceApi("/lesson-plans");
export const syllabus = resourceApi("/syllabus");
export const timetables = resourceApi("/timetables");

// ─── Placements ───

export const placements = {
  // Companies
  listCompanies() {
    return request<ApiResponse<Record<string, unknown>[]>>("/placements/companies");
  },
  createCompany(data: Record<string, unknown>) {
    return request<ApiResponse<Record<string, unknown>>>("/placements/companies", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  updateCompany(id: string, data: Record<string, unknown>) {
    return request<ApiResponse<Record<string, unknown>>>(`/placements/companies/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  deleteCompany(id: string) {
    return request(`/placements/companies/${id}`, { method: "DELETE" });
  },

  // Stats
  listStats(params?: QueryParams) {
    return request<ApiResponse<Record<string, unknown>[]>>(`/placements/stats${toQuery(params)}`);
  },
  upsertStat(data: Record<string, unknown>) {
    return request<ApiResponse<Record<string, unknown>>>("/placements/stats", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  deleteStat(id: string) {
    return request(`/placements/stats/${id}`, { method: "DELETE" });
  },

  // Activities
  listActivities(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/placements/activities${toQuery(params)}`);
  },
  getActivity(id: string) {
    return request<ApiResponse<Record<string, unknown>>>(`/placements/activities/${id}`);
  },
  createActivity(data: Record<string, unknown>, image?: File | null) {
    return request<ApiResponse<Record<string, unknown>>>("/placements/activities", {
      method: "POST",
      body: formData(data, "image", image),
    });
  },
  updateActivity(id: string, data: Record<string, unknown>, image?: File | null) {
    return request<ApiResponse<Record<string, unknown>>>(`/placements/activities/${id}`, {
      method: "PUT",
      body: formData(data, "image", image),
    });
  },
  deleteActivity(id: string) {
    return request(`/placements/activities/${id}`, { method: "DELETE" });
  },
};

// ─── Submissions ───

export const submissions = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/submissions${toQuery(params)}`);
  },
  updateStatus(id: string, status: string) {
    return request(`/submissions/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};

// ─── Audit Logs ───

export const auditLogs = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/audit-logs${toQuery(params)}`);
  },
};

// ─── Results ───

export const results = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/results${toQuery(params)}`);
  },
  get(id: string) {
    return request<ApiResponse<Record<string, unknown>>>(`/results/${id}`);
  },
  create(data: Record<string, unknown>, file?: File | null) {
    return request<ApiResponse<Record<string, unknown>>>("/results", {
      method: "POST",
      body: formData(data, "file", file),
    });
  },
  update(id: string, data: Record<string, unknown>, file?: File | null) {
    return request<ApiResponse<Record<string, unknown>>>(`/results/${id}`, {
      method: "PUT",
      body: formData(data, "file", file),
    });
  },
  delete(id: string) {
    return request(`/results/${id}`, { method: "DELETE" });
  },
};

// ─── MoUs ───

export const mous = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/mous${toQuery(params)}`);
  },
  get(id: string) {
    return request<ApiResponse<Record<string, unknown>>>(`/mous/admin/${id}`);
  },
  create(data: Record<string, unknown>, file?: File | null) {
    return request<ApiResponse<Record<string, unknown>>>("/mous", {
      method: "POST",
      body: formData(data, "document", file),
    });
  },
  update(id: string, data: Record<string, unknown>, file?: File | null) {
    return request<ApiResponse<Record<string, unknown>>>(`/mous/${id}`, {
      method: "PUT",
      body: formData(data, "document", file),
    });
  },
  delete(id: string) {
    return request(`/mous/${id}`, { method: "DELETE" });
  },
};

// ─── Achievements ───

export const achievements = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/achievements${toQuery(params)}`);
  },
  get(id: string) {
    return request<ApiResponse<Record<string, unknown>>>(`/achievements/${id}`);
  },
  create(data: Record<string, unknown>, image?: File | null) {
    return request<ApiResponse<Record<string, unknown>>>("/achievements", {
      method: "POST",
      body: formData(data, "image", image),
    });
  },
  update(id: string, data: Record<string, unknown>, image?: File | null) {
    return request<ApiResponse<Record<string, unknown>>>(`/achievements/${id}`, {
      method: "PUT",
      body: formData(data, "image", image),
    });
  },
  delete(id: string) {
    return request(`/achievements/${id}`, { method: "DELETE" });
  },
};

// ─── Banners ───

export const banners = {
  list(params?: QueryParams) {
    return request<ApiResponse<Record<string, unknown>[]>>(`/banners${toQuery(params)}`);
  },
  get(id: string) {
    return request<ApiResponse<Record<string, unknown>>>(`/banners/${id}`);
  },
  create(data: Record<string, unknown>) {
    return request<ApiResponse<Record<string, unknown>>>("/banners", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update(id: string, data: Record<string, unknown>) {
    return request<ApiResponse<Record<string, unknown>>>(`/banners/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  delete(id: string) {
    return request(`/banners/${id}`, { method: "DELETE" });
  },
};

// ─── Public Documents ───

export const documents = {
  list() {
    return request<{ success: boolean; data: Record<string, unknown>[] }>("/documents/admin/all");
  },
  get(id: string) {
    return request<{ success: boolean; data: Record<string, unknown> }>(`/documents/admin/${id}`);
  },
  create(data: Record<string, unknown>, file: File) {
    return request<{ success: boolean; data: Record<string, unknown> }>("/documents", {
      method: "POST",
      body: formData(data, "file", file),
    });
  },
  update(id: string, data: Record<string, unknown>, file?: File | null) {
    return request<{ success: boolean; data: Record<string, unknown> }>(`/documents/${id}`, {
      method: "PUT",
      body: formData(data, "file", file),
    });
  },
  delete(id: string) {
    return request(`/documents/${id}`, { method: "DELETE" });
  },
};

// ─── Academic Sessions ───

export const sessions = {
  list() {
    return request<ApiResponse<Record<string, unknown>[]>>("/sessions");
  },
  get(id: string) {
    return request<ApiResponse<Record<string, unknown>>>(`/sessions/${id}`);
  },
  create(data: Record<string, unknown>) {
    return request<ApiResponse<Record<string, unknown>>>("/sessions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update(id: string, data: Record<string, unknown>) {
    return request<ApiResponse<Record<string, unknown>>>(`/sessions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  delete(id: string) {
    return request(`/sessions/${id}`, { method: "DELETE" });
  },
};
