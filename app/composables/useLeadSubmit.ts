export interface LeadInputPayload {
  fullName: string
  phone: string
  email?: string
  address?: string
  captchaToken?: string
}

export interface LeadSuccessData {
  leadId: string
  eventId: string
}

export interface LeadErrorDetail {
  code: string
  message: string
  fields?: Record<string, string>
}

export interface LeadApiResponse {
  status: boolean
  message: string
  data?: LeadSuccessData
  error?: LeadErrorDetail
  requestId?: string
}

/**
 * Tạo mã UUID v4 chuẩn RFC 4122 cho Idempotency-Key
 */
function generateUuidV4(): string {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }
  // Fallback RFC 4122 v4 nếu môi trường chưa hỗ trợ randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0
    const value = char === 'x' ? random : (random & 0x3) | 0x8
    return value.toString(16)
  })
}

export function useLeadSubmit() {
  const config = useRuntimeConfig()
  const apiUrl = (config.public.leadApiUrl as string) || 'https://admin.vanphuccare.vn/api/public/leads'

  const isLoading = ref(false)
  const isSuccess = ref(false)
  const fieldErrors = ref<Record<string, string>>({})
  const generalError = ref<string | null>(null)
  const leadResult = ref<LeadSuccessData | null>(null)
  const idempotencyKey = ref<string>(generateUuidV4())

  /**
   * Validate dữ liệu phía Client trước khi gửi request
   */
  function validate(payload: LeadInputPayload): boolean {
    const nextErrors: Record<string, string> = {}
    const fullName = payload.fullName?.trim() || ''
    const phone = payload.phone?.trim() || ''
    const email = payload.email?.trim() || ''
    const address = payload.address?.trim() || ''

    if (!fullName) {
      nextErrors.fullName = 'Vui lòng nhập họ và tên.'
    } else if (fullName.length < 2) {
      nextErrors.fullName = 'Họ và tên cần có ít nhất 2 ký tự.'
    } else if (fullName.length > 120) {
      nextErrors.fullName = 'Họ và tên tối đa 120 ký tự.'
    }

    if (!phone) {
      nextErrors.phone = 'Vui lòng nhập số điện thoại.'
    } else if (!/^0[35789]\d{8}$/.test(phone)) {
      nextErrors.phone = 'Vui lòng nhập số di động Việt Nam gồm 10 số (bắt đầu bằng 03, 05, 07, 08, 09).'
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Vui lòng nhập địa chỉ email hợp lệ.'
    }

    if (address && address.length > 500) {
      nextErrors.address = 'Ghi chú nhu cầu tối đa 500 ký tự.'
    }

    fieldErrors.value = nextErrors
    return Object.keys(nextErrors).length === 0
  }

  /**
   * Gửi dữ liệu Lead lên Backend
   */
  async function submitLead(payload: LeadInputPayload): Promise<boolean> {
    generalError.value = null

    if (!validate(payload)) {
      return false
    }

    isLoading.value = true

    // Chuẩn hóa payload gửi đi: tự động trim, loại bỏ trường rỗng
    const cleanPayload: Record<string, string> = {
      fullName: payload.fullName.trim().replace(/\s+/g, ' '),
      phone: payload.phone.trim(),
    }

    if (payload.email?.trim()) {
      cleanPayload.email = payload.email.trim()
    }

    if (payload.address?.trim()) {
      cleanPayload.address = payload.address.trim().replace(/\s+/g, ' ')
    }

    if (payload.captchaToken?.trim()) {
      cleanPayload.captchaToken = payload.captchaToken.trim()
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey.value,
        },
        credentials: 'omit',
        body: JSON.stringify(cleanPayload),
      })

      let resData: LeadApiResponse | null = null
      try {
        resData = (await response.json()) as LeadApiResponse
      } catch {
        resData = null
      }

      if (response.ok && resData?.status) {
        isSuccess.value = true
        leadResult.value = resData.data ?? null
        fieldErrors.value = {}
        generalError.value = null
        // Đổi key mới cho lần gửi tiếp theo
        idempotencyKey.value = generateUuidV4()
        return true
      }

      // Xử lý các mã lỗi cụ thể từ Backend
      const status = response.status
      const errorDetail = resData?.error

      if (status === 422) {
        if (errorDetail?.fields && Object.keys(errorDetail.fields).length > 0) {
          fieldErrors.value = errorDetail.fields
        } else {
          generalError.value = 'Chưa thể gửi thông tin lúc này. Vui lòng bấm gửi lại hoặc liên hệ hotline để được hỗ trợ nhanh nhất.'
        }
      } else if (status === 429) {
        const retryAfter = response.headers.get('Retry-After')
        generalError.value = retryAfter
          ? `Bạn đã gửi yêu cầu quá nhanh. Vui lòng thử lại sau ${retryAfter} giây.`
          : 'Bạn đã gửi yêu cầu quá nhanh. Vui lòng thử lại sau ít phút.'
      } else if (status === 403) {
        generalError.value = 'Nguồn gửi yêu cầu không được cấp phép.'
      } else if (status === 413) {
        generalError.value = 'Dữ liệu gửi lên vượt quá giới hạn 16KB.'
      } else if (status >= 500) {
        generalError.value = resData?.message || 'Hệ thống đang bảo trì, vui lòng liên hệ hotline để được hỗ trợ nhanh nhất.'
      } else {
        generalError.value = resData?.message || 'Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau.'
      }

      return false
    } catch {
      // Bắt lỗi mất kết nối mạng hoặc timeout
      generalError.value = 'Không thể kết nối đến máy chủ tiếp nhận. Vui lòng kiểm tra kết nối mạng hoặc liên hệ hotline bên dưới.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Reset toàn bộ trạng thái và sinh mã Idempotency mới
   */
  function reset() {
    isLoading.value = false
    isSuccess.value = false
    fieldErrors.value = {}
    generalError.value = null
    leadResult.value = null
    idempotencyKey.value = generateUuidV4()
  }

  return {
    isLoading,
    isSuccess,
    fieldErrors,
    generalError,
    leadResult,
    idempotencyKey,
    validate,
    submitLead,
    reset,
  }
}

