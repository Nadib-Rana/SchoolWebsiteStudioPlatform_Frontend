export interface DnsRecordItem {
  type: 'A' | 'CNAME' | 'TXT'
  name: string
  expected?: string
  value?: string
  current?: string | null
  status: 'VERIFIED' | 'PENDING' | 'MISMATCH'
  lastCheckedAt?: string
}

export interface CustomDomainRecord {
  id: string
  schoolId: string
  domain: string
  status: 'PENDING_DNS' | 'VERIFIED' | 'SSL_ACTIVE' | 'FAILED'
  isPrimary: boolean
  dnsRecords?: DnsRecordItem[]
  verifiedAt?: string | null
  createdAt: string
  sslStatus?: 'ACTIVE' | 'PENDING_PROPAGATION'
  sslDetails?: {
    issuer: string
    protocol: string
    validDays: number
    issuedAt?: string
  }
}

export interface DomainsResponse {
  subdomain: string
  primaryDomain: string | null
  customDomains: CustomDomainRecord[]
}
