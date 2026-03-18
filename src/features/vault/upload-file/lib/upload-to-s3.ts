/**
 * Uploads a file to S3 via a presigned PUT URL using XMLHttpRequest.
 *
 * Uses XHR (not fetch) because:
 * - fetch() does not expose upload progress through a standard API
 * - xhr.upload.onprogress gives reliable byte-level progress events
 *
 * @layer Features — upload-file
 */
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('vault:upload:s3')

export function uploadToS3(
  presignedUrl: string,
  file: File,
  onProgress: (percent: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    log.info('S3 PUT starting', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      s3Host: presignedUrl.split('?')[0],
    })

    const doFetchFallback = async () => {
      log.warn('Attempting fetch fallback for S3 upload...', {
        fileName: file.name,
      })
      try {
        const response = await fetch(presignedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        })

        if (response.ok) {
          log.info('Fetch fallback succeeded!')
          onProgress(100)
          resolve()
        } else {
          const text = await response.text()
          log.error('Fetch fallback failed with HTTP error', {
            status: response.status,
            statusText: response.statusText,
            body: text.slice(0, 500),
          })
          reject(
            new Error(
              `S3 PUT failed with status ${response.status}: ${response.statusText}`,
            ),
          )
        }
      } catch (err) {
        log.error('Fetch fallback ALSO failed with CORS/Network error', err)
        reject(
          new Error(
            `Network error during S3 upload — check browser DevTools Network tab for CORS details`,
          ),
        )
      }
    }

    const xhr = new XMLHttpRequest()
    xhr.open('PUT', presignedUrl)
    xhr.setRequestHeader('Content-Type', file.type)

    log.debug('XHR opened, Content-Type set', { contentType: file.type })

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100)
        if (percent % 25 === 0) {
          log.debug('Upload progress', {
            percent,
            loaded: event.loaded,
            total: event.total,
          })
        }
        onProgress(percent)
      }
    }

    xhr.onreadystatechange = () => {
      log.debug('XHR readyState changed', {
        readyState: xhr.readyState,
        status: xhr.status,
      })
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        log.info('S3 PUT succeeded', { status: xhr.status })
        onProgress(100)
        resolve()
      } else {
        log.error('S3 PUT failed with HTTP error', {
          status: xhr.status,
          statusText: xhr.statusText,
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- xhr.responseText can be null in network-level failures
          responseText: xhr.responseText?.slice(0, 500),
        })
        reject(
          new Error(
            `S3 PUT failed with status ${xhr.status}: ${xhr.statusText}`,
          ),
        )
      }
    }

    xhr.onerror = () => {
      log.error('S3 PUT network error (likely CORS preflight blocked)', {
        status: xhr.status,
        readyState: xhr.readyState,
        s3Host: presignedUrl.split('?')[0],
      })
      // Trigger fallback instead of immediately rejecting
      doFetchFallback()
    }

    xhr.ontimeout = () => {
      log.error('S3 PUT timed out', {
        fileName: file.name,
        fileSize: file.size,
      })
      reject(new Error('S3 upload timed out'))
    }

    xhr.send(file)
    log.debug('XHR.send() called — bytes in flight')
  })
}
