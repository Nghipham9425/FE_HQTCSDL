import axios from "axios"
import { API_ROOT } from "@/utils/constant"

// Shared HTTP client for API modules.
export const apiClient = axios.create({
  baseURL: API_ROOT,
  timeout: 10000,
  withCredentials: true,
})
