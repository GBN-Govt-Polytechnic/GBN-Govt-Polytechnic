/**
 * @file api.ts
 * @description API client — typed fetch wrapper for backend REST endpoints covering departments, news, gallery, placements, contact, and faculty
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

const IS_SERVER = typeof window === "undefined";
const API_URL = IS_SERVER
  ? (process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api` : "http://localhost:4000/api")
  : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api");

// ─── Types ───

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

// ─── Core fetch ───

async function request<T>(path: string, options?: RequestInit & { next?: NextFetchRequestConfig }): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
    // ISR: 60s default — skip revalidate when caller sets cache (e.g. "no-store")
    ...(options?.cache ? {} : { next: { revalidate: 60, ...options?.next } }),
  });

  if (res.status === 204) return undefined as T;

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(json?.message ?? `Request failed (${res.status})`);
  }

  return json as T;
}

// ─── Public endpoints ───

export const departments = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/departments${toQuery(params)}`);
  },
  getBySlug(slug: string) {
    return request<ApiResponse<Record<string, unknown>>>(`/departments/${slug}`);
  },
};

export const faculty = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/faculty${toQuery(params)}`);
  },
};

export const news = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/news${toQuery(params)}`);
  },
  get(id: string) {
    return request<ApiResponse<Record<string, unknown>>>(`/news/${id}`);
  },
  getBySlug(slug: string) {
    return request<ApiResponse<Record<string, unknown>>>(`/news/slug/${slug}`);
  },
};

export const events = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/events${toQuery(params)}`);
  },
  get(id: string) {
    return request<ApiResponse<Record<string, unknown>>>(`/events/${id}`);
  },
};

export const gallery = {
  listAlbums(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/gallery${toQuery(params)}`);
  },
  getAlbum(id: string) {
    return request<ApiResponse<Record<string, unknown>>>(`/gallery/${id}`);
  },
};

export const heroSlides = {
  list() {
    return request<PaginatedResponse<Record<string, unknown>>>("/hero-slides");
  },
};

export const courses = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/courses${toQuery(params)}`);
  },
};

export const labs = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/labs${toQuery(params)}`);
  },
};

export const studyMaterials = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/study-materials${toQuery(params)}`);
  },
};

export const lessonPlans = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/lesson-plans${toQuery(params)}`);
  },
};

export const syllabus = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/syllabus${toQuery(params)}`);
  },
};

export const timetables = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/timetables${toQuery(params)}`);
  },
};

export const placements = {
  listCompanies() {
    return request<ApiResponse<Record<string, unknown>[]>>("/placements/companies");
  },
  listStats(params?: QueryParams) {
    return request<ApiResponse<Record<string, unknown>[]>>(`/placements/stats${toQuery(params)}`);
  },
  listActivities(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/placements/activities${toQuery(params)}`);
  },
};

export const results = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/results${toQuery(params)}`);
  },
};

export const achievements = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/achievements${toQuery(params)}`);
  },
};

export const publicDocuments = {
  list() {
    return request<ApiResponse<Record<string, unknown>[]>>("/documents", {
      next: { revalidate: 300 },
    });
  },
};

export const mous = {
  list(params?: QueryParams) {
    return request<PaginatedResponse<Record<string, unknown>>>(`/mous${toQuery(params)}`);
  },
};

export const banners = {
  listActive() {
    return request<ApiResponse<Record<string, unknown>[]>>("/banners/active", {
      next: { revalidate: 30 },
    });
  },
};

export const settings = {
  get() {
    return request<ApiResponse<Record<string, unknown>>>("/settings");
  },
};

// ─── Public form submissions ───

export const contact = {
  submit(data: { name: string; email: string; phone?: string; subject: string; message: string }) {
    return request<ApiResponse<Record<string, unknown>>>("/contact", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

export const complaints = {
  submit(data: { name: string; email: string; phone?: string; subject: string; message: string }) {
    return request<ApiResponse<Record<string, unknown>>>("/complaints", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

export const sessions = {
  list() {
    return request<ApiResponse<Record<string, unknown>[]>>("/sessions");
  },
};

export const dashboard = {
  stats() {
    return request<ApiResponse<Record<string, unknown>>>("/dashboard/stats");
  },
};
