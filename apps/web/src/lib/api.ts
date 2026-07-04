type RequestOptions = {
  headers?: Record<string, string>
  params?: Record<string, string>
  cache?: RequestCache
  next?: { revalidate?: number; tags?: string[] }
}

class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    try {
      const session = JSON.parse(localStorage.getItem('next-auth.session-token') || 'null')
      return session?.accessToken || null
    } catch {
      return null
    }
  }

  private buildUrl(path: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}${path}`, window.location.origin)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, value)
        }
      })
    }
    return url.toString()
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    const token = this.getToken()
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...options?.headers,
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(this.buildUrl(path, options?.params), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      cache: options?.cache,
      next: options?.next,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new ApiError(
        error.message || `Request failed with status ${response.status}`,
        response.status,
        error
      )
    }

    return response.json()
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', path, undefined, options)
  }

  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', path, body, options)
  }

  async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', path, body, options)
  }

  async patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', path, body, options)
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', path, undefined, options)
  }

  async upload<T>(path: string, formData: FormData, options?: RequestOptions): Promise<T> {
    const token = this.getToken()
    const headers: Record<string, string> = { ...options?.headers }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    const response = await fetch(this.buildUrl(path, options?.params), {
      method: 'POST',
      headers,
      body: formData,
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new ApiError(
        error.message || 'Upload failed',
        response.status,
        error
      )
    }
    return response.json()
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const api = new ApiClient(process.env.NEXT_PUBLIC_API_URL || '/api')
export default api
