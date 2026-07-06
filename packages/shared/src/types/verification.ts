export interface IdentityVerification {
  id: string;
  userId: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  documentType: 'passport' | 'drivers_license' | 'national_id';
  documentUrl: string;
  selfieUrl: string | null;
  addressProofUrl: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}
