import api from './api';

export const memberService = {
  async getMembers(params?: any) {
    const response = await api.get('/members/', { params });
    return response.data;
  },

  async getMember(id: number) {
    const response = await api.get(`/members/${id}/`);
    return response.data;
  },

  async getMemberBySlug(slug: string) {
    const response = await api.get(`/members/slug/${slug}/`);
    return response.data;
  },

  async getPublicMember(id: number) {
    const response = await api.get(`/public-members/${id}/`);
    return response.data;
  },

  async getTeams() {
    const response = await api.get('/teams/');
    return response.data;
  },

  async getMembershipTypes() {
    const response = await api.get('/membership-types/');
    return response.data;
  },

  async getApplications() {
    const response = await api.get('/membership-applications/');
    return response.data;
  },

  async getMyApplications() {
    const response = await api.get('/membership-applications/');
    return response.data;
  },

  async getApplicationDetail(id: number) {
    const response = await api.get(`/membership-applications/${id}/`);
    return response.data;
  },

  async updateApplication(id: number, data: any) {
    const response = await api.patch(`/membership-applications/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async submitApplication(data: any) {
    const response = await api.post('/membership-applications/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async approveSimulatedApplication() {
    const response = await api.post('/membership-applications/approve-simulated/');
    return response.data;
  },

  // ──────────────────────────────────────────
  // OTP Verification
  // ──────────────────────────────────────────
  async sendEmailOTP(email: string) {
    try {
      const response = await api.post('/auth/otp/send-email/', { email });
      return response.data;
    } catch (err: any) {
      return err.response?.data || { success: false, error: "Failed to send email OTP" };
    }
  },

  async verifyEmailOTP(email: string, otp: string) {
    try {
      const response = await api.post('/auth/otp/verify-email/', { email, otp });
      return response.data;
    } catch (err: any) {
      return err.response?.data || { success: false, error: "Failed to verify email OTP" };
    }
  },

  async sendMobileOTP(mobile: string) {
    try {
      const response = await api.post('/auth/otp/send-mobile/', { mobile });
      return response.data;
    } catch (err: any) {
      return err.response?.data || { success: false, error: "Failed to send mobile OTP" };
    }
  },

  async verifyMobileOTP(mobile: string, otp: string) {
    try {
      const response = await api.post('/auth/otp/verify-mobile/', { mobile, otp });
      return response.data;
    } catch (err: any) {
      return err.response?.data || { success: false, error: "Failed to verify mobile OTP" };
    }
  },

  async checkAvailability(email?: string, mobile?: string, pan?: string) {
    try {
      const response = await api.post('/auth/check-availability/', { email, mobile, pan });
      return response.data;
    } catch (err: any) {
      return err.response?.data || { success: false, error: "Failed to check availability" };
    }
  },

  // ──────────────────────────────────────────
  // Officer Endpoints
  // ──────────────────────────────────────────
  async getOfficerApplications() {
    const response = await api.get('/officer/applications/');
    return response.data;
  },

  async updateApplicationStatus(id: number, status: string, remarks: string) {
    const response = await api.post(`/officer/applications/${id}/status/`, { status, remarks });
    return response.data;
  },

  async sendExecutiveReview(id: number, recipientType: 'user' | 'ceo', reviews: Record<string, string>) {
    const response = await api.post(`/officer/applications/${id}/send-review/`, {
      recipient_type: recipientType,
      reviews
    });
    return response.data;
  },

  // ──────────────────────────────────────────
  // Razorpay Payment Endpoints
  // ──────────────────────────────────────────
  async createRazorpayOrder(application_id: number) {
    const response = await api.post('/payments/razorpay/create-order/', { application_id });
    return response.data;
  },

  async verifyRazorpayPayment(data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; application_id: number }) {
    const response = await api.post('/payments/razorpay/verify-payment/', data);
    return response.data;
  },

  async upgradeToPrime() {
    const response = await api.post('/members/upgrade-prime/');
    return response.data;
  },
};