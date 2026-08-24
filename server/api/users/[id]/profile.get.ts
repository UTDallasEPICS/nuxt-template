import fs from 'node:fs'
import path from 'node:path'
import { fileTypeFromFile } from 'file-type'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const userId = getRouterParam(event, 'id')

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing userId' })
  }

  const record = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      image: true,
    },
  })

  const imagePath = record?.image

  const filePath = path.join(
    process.env.UPLOAD_STORAGE_PATH || 'public/images',
    imagePath || 'null'
  )

  if (!fs.existsSync(filePath)) {
    throw createError({ statusCode: 404, statusMessage: 'File not found' })
  }

  // Files are stored without an extension, so detect the MIME type from the
  // file's magic bytes. Falls back to a generic type if detection fails.
  const detected = await fileTypeFromFile(filePath)
  setHeader(event, 'Content-Type', detected?.mime ?? 'application/octet-stream')

  const fileStream = fs.createReadStream(filePath)

  return sendStream(event, fileStream)
})
