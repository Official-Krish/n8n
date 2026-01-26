import axios from "axios";
import type { IdResponse, SigninResponse, Workflow } from "./types/api";

const API_BASE =
  (import.meta as any).env?.VITE_BACKEND_URL?.toString?.() ??
  "http://localhost:3001/api/v1";

export const api = axios.create({
  baseURL: API_BASE,
});


export function setAuthToken(token: string) {
  localStorage.setItem("token", `Bearer ${token}`);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export function setAvatarUrl(avatarUrl: string) {
  localStorage.setItem("avatarUrl", avatarUrl);
}

// AUTH

export async function apiSignup(body: { username: string; password: string, email: string, avatarUrl: string }): Promise<IdResponse | { status: number }> {
  const res = await api.post<IdResponse>("/user/signup", body);
  if (res.data.token) {
    setAuthToken(res.data.token);
    setAvatarUrl(body.avatarUrl);
  } else if (res.status === 409) {
    return {
      status: res.status
    };
  }
  else {
    throw new Error("No token received");
  }
  return res.data;
}

export async function apiSignin(body: { username: string; password: string }): Promise<SigninResponse> {
  const res = await api.post<SigninResponse>("/user/signin", body);
  if (!res.data.token) {
    throw new Error("No token received");
  }
  setAuthToken(res.data.token);
  setAvatarUrl(res.data.avatarUrl);
  return res.data;
}

export async function apiVerifyToken(): Promise<{ message: string }> {
  const res = await api.get<{ message: string }>("/user/verify", {
    headers: {
      Authorization: localStorage.getItem("token") || "",
    },
  });
  return res.data;
}

export async function apiGetProfile(): Promise<{ username: string; email: string; avatarUrl: string, totalWorkflows: number, memberSince: string }> {
  const res = await api.get<{ username: string; email: string; avatarUrl: string, totalWorkflows: number, memberSince: string }>("/user/profile", {
    headers: {
      Authorization: localStorage.getItem("token") || "",
    },
  });
  return res.data;
}

export async function apiUpdateProfile(body: { email?: string; avatarUrl: string }): Promise<{ message: string }> {
  const res = await api.post<{ message: string }>("/user/update-avatar", body, {
    headers: {
      Authorization: localStorage.getItem("token") || "",
    },
  });
  if (res.status === 200) {
    setAvatarUrl(body.avatarUrl);
  }
  return res.data;
}

// WORKFLOW

export async function apiCreateWorkflow(body: any): Promise<IdResponse> {
  const res = await api.post<IdResponse>("/workflow", body, {
    headers: {
      Authorization: localStorage.getItem("token") || "",
    },
  });
  return res.data;
}

export async function apiUpdateWorkflow(workflowId: string, body: any): Promise<IdResponse> {
  const res = await api.put<IdResponse>(`/workflow/${workflowId}`, body, {
    headers: {
      Authorization: localStorage.getItem("token") || "",
    },
  });
  return res.data;
}

export async function apiGetWorkflow(workflowId: string): Promise<Workflow> {
  const res = await api.get<{ message: string; workflow: Workflow }>(`/workflow/${workflowId}`, {
    headers: {
      Authorization: localStorage.getItem("token") || "",
    },
  });
  return res.data.workflow;
}

export async function apiGetAllWorkflows(): Promise<{ workflows: Workflow[] }> {
  const res = await api.get<{ message: string; workflows: Workflow[] }>("/workflow/getAll", {
    headers: {
      Authorization: localStorage.getItem("token") || "",
    },
  });
  return res.data;
}

export async function apiGetExecution(workflowId: string) {
  const res = await api.get(`/workflow/executions/${workflowId}`, {
    headers: {
      Authorization: localStorage.getItem("token") || "",
    },
  });
  return res.data;
} 