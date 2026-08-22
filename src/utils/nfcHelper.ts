// Web NFC API interface declarations
declare global {
  interface Window {
    NDEFReader?: {
      new (): NDEFReaderInstance;
    };
  }
}

export interface NDEFReaderInstance {
  scan: () => Promise<void>;
  write: (message: any) => Promise<void>;
  addEventListener: (
    type: 'reading' | 'readingerror',
    listener: (event: any) => void
  ) => void;
  removeEventListener: (
    type: 'reading' | 'readingerror',
    listener: (event: any) => void
  ) => void;
}

export interface NFCPermissionStatus {
  supported: boolean;
  permission: 'granted' | 'prompt' | 'denied' | 'unknown' | 'unsupported';
  isAndroid: boolean;
  isChrome: boolean;
  errorDetail?: string;
}

export function isWebNFCSupported(): boolean {
  return typeof window !== 'undefined' && 'NDEFReader' in window;
}

export function detectEnvironment(): { isAndroid: boolean; isChrome: boolean; isIOS: boolean } {
  if (typeof window === 'undefined') {
    return { isAndroid: false, isChrome: false, isIOS: false };
  }
  const ua = navigator.userAgent || '';
  const isAndroid = /android/i.test(ua);
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isChrome = /chrome|crios/i.test(ua) && !/edg/i.test(ua);

  return { isAndroid, isChrome, isIOS };
}

export async function checkNFCPermission(): Promise<NFCPermissionStatus> {
  const { isAndroid, isChrome } = detectEnvironment();

  if (!isWebNFCSupported()) {
    return {
      supported: false,
      permission: 'unsupported',
      isAndroid,
      isChrome,
      errorDetail: isAndroid 
        ? 'Trình duyệt chưa hỗ trợ Web NFC. Hãy sử dụng Google Chrome trên Android.' 
        : 'Web NFC API chỉ khả dụng trên trình duyệt Chrome (Android).',
    };
  }

  if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
    try {
      // @ts-ignore - 'nfc' permission descriptor
      const status = await navigator.permissions.query({ name: 'nfc' as any });
      return {
        supported: true,
        permission: status.state as 'granted' | 'prompt' | 'denied',
        isAndroid,
        isChrome,
      };
    } catch (e) {
      // Some browsers throw on querying 'nfc'
      return {
        supported: true,
        permission: 'unknown',
        isAndroid,
        isChrome,
      };
    }
  }

  return {
    supported: true,
    permission: 'unknown',
    isAndroid,
    isChrome,
  };
}

export async function requestNFCPermissionAndScan(): Promise<{
  success: boolean;
  ndef?: NDEFReaderInstance;
  error?: {
    type: 'permission_denied' | 'nfc_disabled' | 'unsupported' | 'unknown';
    message: string;
    actionGuide?: string;
  };
}> {
  if (!isWebNFCSupported()) {
    return {
      success: false,
      error: {
        type: 'unsupported',
        message: 'Trình duyệt này không hỗ trợ Web NFC API.',
        actionGuide: 'Vui lòng mở trang web này bằng Google Chrome trên Android, hoặc sử dụng tính năng Quét QR để điểm danh.',
      },
    };
  }

  try {
    const ndef = new window.NDEFReader!();
    await ndef.scan();
    return {
      success: true,
      ndef,
    };
  } catch (err: any) {
    console.error('NFC Scan Request Error:', err);
    const errorName = err.name || '';
    const errorMsg = err.message || '';

    if (errorName === 'NotAllowedError') {
      return {
        success: false,
        error: {
          type: 'permission_denied',
          message: 'Bạn hoặc trình duyệt đã từ chối / chặn quyền NFC cho trang web này.',
          actionGuide: 'Bấm vào biểu tượng ổ khóa 🔒 (hoặc Cài đặt trang web) trên thanh địa chỉ Chrome -> Quyền -> NFC -> Chọn "Cho phép" (Allow).',
        },
      };
    }

    if (errorName === 'NotReadableError' || errorMsg.toLowerCase().includes('disabled') || errorMsg.toLowerCase().includes('hardware')) {
      return {
        success: false,
        error: {
          type: 'nfc_disabled',
          message: 'Chức năng NFC trên điện thoại Android đang bị tắt.',
          actionGuide: 'Vuốt từ đỉnh màn hình điện thoại xuống (thanh Cài đặt nhanh) và chạm bật biểu tượng NFC, sau đó thử lại.',
        },
      };
    }

    return {
      success: false,
      error: {
        type: 'unknown',
        message: `Không thể kích hoạt NFC: ${errorMsg || 'Vui lòng kiểm tra lại thiết bị'}`,
        actionGuide: 'Đảm bảo máy có hỗ trợ NFC, đã bật NFC trong Cài đặt và cấp quyền cho Chrome.',
      },
    };
  }
}

export async function startNFCScan(
  onTagRead: (tagData: { serialNumber?: string; text?: string; url?: string }) => void,
  onError: (error: { type: 'permission_denied' | 'nfc_disabled' | 'unsupported' | 'unknown'; message: string; actionGuide?: string }) => void
): Promise<(() => void) | null> {
  const result = await requestNFCPermissionAndScan();

  if (!result.success || !result.ndef) {
    if (result.error) {
      onError(result.error);
    }
    return null;
  }

  const ndef = result.ndef;

  const readingListener = (event: any) => {
    const serialNumber = event.serialNumber || '';
    let text = '';
    let url = '';

    if (event.message && event.message.records) {
      for (const record of event.message.records) {
        if (record.recordType === 'text') {
          const textDecoder = new TextDecoder(record.encoding || 'utf-8');
          text = textDecoder.decode(record.data);
        } else if (record.recordType === 'url') {
          const textDecoder = new TextDecoder();
          url = textDecoder.decode(record.data);
        }
      }
    }

    onTagRead({ serialNumber, text, url });
  };

  const errorListener = () => {
    onError({
      type: 'unknown',
      message: 'Không thể đọc dữ liệu từ thẻ NFC. Vui lòng giữ cố định mặt lưng điện thoại gần thẻ trong 1-2 giây.',
    });
  };

  ndef.addEventListener('reading', readingListener);
  ndef.addEventListener('readingerror', errorListener);

  return () => {
    try {
      ndef.removeEventListener('reading', readingListener);
      ndef.removeEventListener('readingerror', errorListener);
    } catch (e) {
      console.warn('Error removing NFC listener', e);
    }
  };
}
