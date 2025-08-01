// src/lib/secureLogger.ts
import { encrypt, hash, generateToken } from './encryption';

interface SecureLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  resourceType?: string;
  resourceId?: string;
  details?: Record<string, any>;
  severity: 'info' | 'warning' | 'error' | 'critical';
  sessionId?: string;
  encryptedData?: string;
}

/**
 * Secure logger for sensitive admin activities
 */
export class SecureLogger {
  
  /**
   * Log admin activity with encryption for sensitive data
   */
  static async logAdminActivity(params: {
    action: string;
    userId?: string;
    userEmail?: string;
    ipAddress?: string;
    userAgent?: string;
    resourceType?: string;
    resourceId?: string;
    details?: Record<string, any>;
    severity?: 'info' | 'warning' | 'error' | 'critical';
    sessionId?: string;
  }) {
    try {
      const logId = generateToken(16);
      
      // Encrypt sensitive details
      const sensitiveData = {
        userEmail: params.userEmail,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        details: params.details
      };
      
      const encryptedData = encrypt(JSON.stringify(sensitiveData));
      
      const logEntry: SecureLogEntry = {
        id: logId,
        timestamp: new Date(),
        action: params.action,
        userId: params.userId,
        resourceType: params.resourceType,
        resourceId: params.resourceId,
        severity: params.severity || 'info',
        sessionId: params.sessionId,
        encryptedData
      };
      
      // Store to database (implement your database call here)
      console.log('🔐 Secure Log Entry:', {
        id: logEntry.id,
        action: logEntry.action,
        severity: logEntry.severity,
        timestamp: logEntry.timestamp,
        hasEncryptedData: !!logEntry.encryptedData
      });
      
      return logEntry;
      
    } catch (error) {
      console.error('❌ Secure logging failed:', error);
      throw error;
    }
  }
  
  /**
   * Log security alert with high encryption
   */
  static async logSecurityAlert(params: {
    alertType: string;
    description: string;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    threatLevel: 'low' | 'medium' | 'high' | 'critical';
    additionalData?: Record<string, any>;
  }) {
    return this.logAdminActivity({
      action: `SECURITY_ALERT_${params.alertType.toUpperCase()}`,
      userId: params.userId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      severity: params.threatLevel === 'critical' ? 'critical' : 'error',
      details: {
        alertType: params.alertType,
        description: params.description,
        threatLevel: params.threatLevel,
        ...params.additionalData
      }
    });
  }
  
  /**
   * Log file upload activity
   */
  static async logFileUpload(params: {
    userId: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    uploadPath: string;
    ipAddress?: string;
  }) {
    return this.logAdminActivity({
      action: 'FILE_UPLOAD',
      userId: params.userId,
      ipAddress: params.ipAddress,
      resourceType: 'file',
      resourceId: params.fileName,
      severity: 'info',
      details: {
        fileName: params.fileName,
        fileSize: params.fileSize,
        fileType: params.fileType,
        uploadPath: params.uploadPath
      }
    });
  }
  
  /**
   * Generate audit trail hash for integrity verification
   */
  static generateAuditHash(logEntry: SecureLogEntry): string {
    const auditString = `${logEntry.id}:${logEntry.timestamp.toISOString()}:${logEntry.action}:${logEntry.userId || ''}`;
    return hash(auditString);
  }
}
